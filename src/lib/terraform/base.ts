import path from 'path';
import { promises as fs } from 'fs';
import { TFAction, type TFState } from '$/types/terraform';
import * as SystemUtils from '$/lib/utils/system';
import { createTempDir, formatTfVars, formatNodeConfig, parseJsonLines } from '$/lib/terraform/utils';
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

		const cwd = process.cwd()

		// Create fresh temporary directory
		console.log(`Creating working directory for Terraform...`)
		tempDir = await createTempDir()
		if (!tempDir)
			throw new Error('Cluster could not be updated.')

		console.log(`Created: ${tempDir}`)

		try {
			// Copy the provider-specific Terraform files
			console.log(`Copying Terraform config files for ${this.type}...`, tempDir)
			console.log(`cp -r "${cwd}/infernet-deploy/procure/${this.type.toLowerCase()}" "${tempDir}"`)
			await fs.cp(
				`${cwd}/infernet-deploy/procure/${this.type.toLowerCase()}`,
				tempDir,
				{
					'recursive': true,
				}
			)

			// Copy the Docker Compose files
			console.log(`Copying Docker Compose files...`, tempDir)
			console.log(`cp "${cwd}/infernet-deploy/deploy.tar.gz" "${tempDir}/deploy.tar.gz"`)
			await fs.copyFile(`${cwd}/infernet-deploy/deploy.tar.gz`, `${tempDir}/deploy.tar.gz`)

			// Create terraform files
			console.log(`Writing Terraform files for cluster "${cluster.id}" and service account "${serviceAccount.id}"...`, tempDir);
			await this.writeTerraformFiles(tempDir, cluster, serviceAccount);

			// Create node config files under configs/
			await createNodeConfigFiles(tempDir, cluster.nodes);

			// If state file exists in db, write it to file
			if (cluster?.latest_deployment?.tfstate) {
				console.log(`Found existing Terraform state in database. Writing JSON to "./terraform.tfstate"...`);

				await SystemUtils.writeJsonToFile(
					path.join(tempDir, 'terraform.tfstate'),
					cluster?.latest_deployment?.tfstate
				)
			}

			const commands = (
				[
					{
						action: TFAction.Init,
						command: 'terraform init -json -no-color',
						statusMessage: 'Initializing Terraform project...',
						errorMessage: 'Error initializing Terraform project.',
					},
					[TFAction.Plan, TFAction.Apply, TFAction.Destroy].includes(action) && {
						action: TFAction.Plan,
						command: action === TFAction.Plan ? `terraform plan -json -no-color` : `terraform plan -destroy -json -no-color`,
						statusMessage: 'Creating Terraform plan...',
						errorMessage: 'Error creating Terraform plan.',
					},
					action === TFAction.Apply && {
						action: TFAction.Apply,
						command: `terraform apply -auto-approve -json -no-color`,
						statusMessage: 'Applying changes to resources...',
						errorMessage: 'Error applying changes to resources.',
					},
					action === TFAction.Destroy && {
						action: TFAction.Destroy,
						command: `terraform apply -destroy -auto-approve -json -no-color`,
						statusMessage: 'Destroying resources...',
						errorMessage: 'Error destroying resources.',
					},
				]
					.filter(Boolean)
			)

			const result = []

			for(const command of commands){
				if(!command) continue

				console.log(command.statusMessage, tempDir)

				const {
					error,
					stdout,
					stderr,
				} = await SystemUtils.executeCommands(
					tempDir,
					command.command
				)

				if(error){
					console.error(command.errorMessage)
					console.error(error)
				}

				const tfstate = await SystemUtils.readJsonFromFile<TFState>(
					path.join(tempDir, 'terraform.tfstate')
				)
					.catch(e => {
						console.error(e)
						return null
					})

				result.push({
					action: command.action,
					command: command.command,
					output: {
						error: error?.message,
						tfstate,
						stdout: parseJsonLines(stdout),
						stderr: parseJsonLines(stderr),
					},
				})

				if(error)
					break
			}

			return result
		}finally{
			// Remove temporary directory
			if(tempDir){
				try {
					await SystemUtils.removeDir(tempDir)
					console.log(`Removed working directory for Terraform ${tempDir}`); 
				}catch(e){
					console.error(e)
				}
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
	tfVars: Record<string, any>,
): Promise<void> => {
	await fs.writeFile(
		path.join(tempDir, 'terraform.tfvars'),
		formatTfVars(tfVars)
	);
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
		const nodeId = `infernet-node-${node.id}`;

		const jsonConfig = formatNodeConfig(node);

		await SystemUtils.writeJsonToFile(
			path.join(tempDir, 'configs', `${nodeId}.json`),
			jsonConfig
		);

		console.log(`Created: configs/${nodeId}.json`);
	}
};

