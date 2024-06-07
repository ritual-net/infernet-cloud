import path from 'path';
import { promises as fs } from 'fs';
import { TFAction, type TFState } from '$/types/terraform';
import * as SystemUtils from '$/lib/utils/system';
import { createTempDir, formatTfVars, formatNodeConfig } from '$/lib/terraform/utils';
import type { CommandExecutionError } from '$/types/error';
import type { ProviderCluster, ProviderServiceAccount, ProviderTypeEnum } from '$/types/provider';
import type { InfernetNode } from "$schema/interfaces";

/**
 * Base class for Terraform deployments.
 *
 * @remarks This class is NOT meant to be instantiated directly. Instead, use one of the subclasses.
 * The subclasses are supposed to override the setupTmpDir method to handle provider-specific setup.
 */
export abstract class BaseTerraform {
	/**
	 * The provider type.
	 */
	public abstract readonly type: ProviderTypeEnum;

	/**
	 * Writes Terraform files to the temporary directory.
	 *
	 * @param tempDir The path to the temporary directory.
	 * @param cluster The ProviderCluster to deploy.
	 * @param serviceAccount The ProviderServiceAccount to use for deployment.
	 *
	 * @remarks This method is supposed to be overridden by subclasses, since Terraform
	 *   configuration is provider-specific, and might require different files,
	 *   variables, and actions.
	 */
	protected abstract writeTerraformFiles(
		tempDir: string,
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount
	): Promise<void>;

	/**
	 * Applies a Terraform action:
	 * 	- Creates a temporary directory
	 *  - Writes terraform files and configuration files
	 *  - Writes tfstate file from database, if it exists
	 *  - Runs `terraform init`, then `terraform {apply, destroy}`
	 *  - Parses output for resource information
	 *  - Stores updated tfstate to the database
	 *  - Purges the temporary directory
	 *
	 * @param cluster The ProviderCluster to use.
	 * @param serviceAccount The ProviderServiceAccount to use.
	 * @returns An object with the success status, error, and terraform state.
	 */
	public async action(
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount,
		action: TFAction
	) {
		let tempDir: string | undefined = undefined

		try {
			const cwd = process.cwd();

			// Create fresh temporary directory
			console.log(`Creating working directory for Terraform...`);
			tempDir = await createTempDir();
			console.log(`Created: ${tempDir}`);

			// Copy the provider-specific Terraform files
			console.log(`Copying Terraform config files for ${this.type}...`, tempDir);
			console.log(`cp -r "${cwd}/infernet-deploy/procure/${this.type.toLowerCase()}" "${tempDir}"`);
			await fs.cp(
				`${cwd}/infernet-deploy/procure/${this.type.toLowerCase()}`,
				tempDir,
				{
					'recursive': true,
				}
			);

			// Copy the Docker Compose files
			console.log(`Copying Docker Compose files...`, tempDir);
			console.log(`cp "${cwd}/infernet-deploy/deploy.tar.gz" "${tempDir}/deploy.tar.gz"`);
			await fs.copyFile(`${cwd}/infernet-deploy/deploy.tar.gz`, `${tempDir}/deploy.tar.gz`);

			// Create terraform files
			console.log(`Writing Terraform files for cluster "${cluster.id}" and service account "${serviceAccount.id}"...`, tempDir);
			await this.writeTerraformFiles(tempDir, cluster, serviceAccount);

			// Create node config files under configs/
			await createNodeConfigFiles(tempDir, cluster.nodes);

			// If state file exist in db, write it to file
			if (cluster?.tfstate) {
				await SystemUtils.writeJsonToFile(
					path.join(tempDir, 'terraform.tfstate'),
					JSON.parse(cluster.tfstate)
				);
			}

			// Initialize terraform
			console.log(`Initializing Terraform project...`, tempDir);
			console.log(`terraform init`);
			await SystemUtils.executeCommands(tempDir, 'terraform init');
			if (!tempDir) {
				return { success: false, error: 'Cluster could not be updated.' };
			}

			let logs: any;
			let error: string | undefined;
			try {
				console.log(`Running Terraform action "${action}"...`);
				console.log(`terraform ${action} -auto-approve -json -no-color`);

				const stdout = await SystemUtils.executeCommands(tempDir, `terraform ${action} -auto-approve -json -no-color`);
				logs = JSON.parse(stdout);
			} catch (e) {
				// We catch the error here so we can store the state file in the db.
				// Even if the apply fails, the cluster may be partially created / updated,
				// so we want the state file to reflect that.
				const commandError = e as CommandExecutionError;
				error = commandError.stderr ?? commandError.error ?? commandError;

				console.error(`Error running Terraform action "${action}":`);
				console.error(error);
			}

			// Store state file in db under cluster entry
			const state = (await SystemUtils.readJsonFromFile(
				path.join(tempDir, 'terraform.tfstate')
			)) as TFState;

			return { success: error ? false : true, error, state, logs };
		}catch(error){
			return { success: false, error: JSON.stringify(error) };
		}finally{
			// Remove temporary directory
			if(tempDir){
				SystemUtils.removeDir(tempDir);
				console.log(`Removed working directory for Terraform ${tempDir}`); 
			}
		}
	}
}

/**
 * Creates a terraform.tfvars file from an object.
 *
 * @param tempDir The path to the temporary directory.
 * @param tfVars The object to write to the file.
 */
export const createTerraformVarsFile = async (
	tempDir: string,
	tfVars: Record<string, string[] | string | number | boolean | Record<string, string>>
): Promise<void> => {
	const varsFile = path.join(tempDir, 'terraform.tfvars');
	const varsString = formatTfVars(tfVars);
	await fs.writeFile(varsFile, varsString);
};

/**
 * Creates node config files from an array of InfernetNode objects.
 *
 * @param tempDir The path to the temporary directory.
 * @param nodes The array of InfernetNode objects.
 */
const createNodeConfigFiles = async (
	tempDir: string,
	nodes: InfernetNode[]
): Promise<void> => {
	// Create configs/ directory
	console.log(`Creating node configs...`, tempDir);
	console.log(`mkdir -p "configs"`);
	await fs.mkdir(path.join(tempDir, 'configs'), { recursive: true });

	// Create node config files under configs/
	for (const node of nodes) {
		const jsonConfig = formatNodeConfig(node);

		await fs.writeFile(
			path.join(tempDir, `configs/${node.id}.json`),
			JSON.stringify(jsonConfig, null, 2)
		);

		console.log(`Created: configs/${node.id}.json`);
	}
};

