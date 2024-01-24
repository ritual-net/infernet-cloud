import path from 'path';
import * as SystemUtils from '$utils/system';
import * as TerraformUtils from '$utils/terraform';
import type { CommandExecutionError } from '$types/error';
import type { ProviderCluster, ProviderServiceAccount, ProviderTypeEnum } from '$types/provider';

/**
 * Base class for Terraform deployments.
 *
 * @remarks This class is NOT menat to be instantiated directly. Instead, use one of the subclasses.
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
	 * @remarks This method is supposed to be overridden by subclasses.
	 */
	protected abstract writeTerraformFiles(
		tempDir: string,
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount
	): Promise<void>;

	/**
	 * Sets up the temporary directory for Terraform deployment.
	 *
	 * @param cluster The ProviderCluster to deploy.
	 * @param serviceAccount The ProviderServiceAccount to use for deployment.
	 * @returns The path to the temporary directory.
	 */
	private async setupTmpDir(
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount
	): Promise<string> {
		// Create fresh temporary directory
		const tempDir = await TerraformUtils.createTempDir(this.type);

		// Create terraform files
		await this.writeTerraformFiles(tempDir, cluster, serviceAccount);

		// Create node config files under configs/
		await TerraformUtils.createNodeConfigFiles(tempDir, cluster.nodes);

		// If state file exist in db, write it to file
		if (cluster?.tfstate) {
			await SystemUtils.writeJsonToFile(
				path.join(tempDir, 'terraform.tfstate'),
				JSON.parse(cluster.tfstate)
			);
		}

		// Initialize terraform
		await SystemUtils.executeCommands(tempDir, 'terraform init');
		return tempDir;
	}

	/**
	 * Applies the Terraform deployment.
	 *
	 * @param cluster The ProviderCluster to deploy.
	 * @param serviceAccount The ProviderServiceAccount to use.
	 * @returns An object with the success status, message, and terraform state.
	 */
	public async apply(
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount
	): Promise<{
		success: boolean;
		message?: unknown;
		state?: object;
	}> {
		// Set up temporary directory
		const tempDir = await this.setupTmpDir(cluster, serviceAccount);
		if (!tempDir) {
			return { success: false, message: 'Cluster could not be retrieved.' };
		}

		let error;
		try {
			// Terraform apply
			const result = await SystemUtils.executeCommands(tempDir, 'terraform apply -auto-approve');

			const nodeInfo = TerraformUtils.parseTerraformOutput(result);
			console.log(nodeInfo);
			// TODO: maybe use name postfix (i.e. db id) for finding nodes in the db
			// TODO: Store nodeInfo in db, probably as a json (aws/gcp agnostic?)
		} catch (e) {
			// We catch the error here so we can store the state file in the db.
			// Even if the apply fails, the cluster may be partially created / updated,
			// so we want the state file to reflect that.
			const commandError = e as CommandExecutionError;
			error = commandError.stderr ?? commandError.error;
			console.error(error);
		}

		// Store state file in db under cluster entry
		const state = await SystemUtils.readJsonFromFile(path.join(tempDir, 'terraform.tfstate'));

		// Remove temporary directory
		SystemUtils.removeDir(tempDir);

		if (error) {
			return { success: false, message: error, state };
		}
		return { success: true, message: 'Cluster created successfully', state };
	}

	/**
	 * Destroys the Terraform deployment.
	 *
	 * @param cluster The ProviderCluster to deploy.
	 * @param serviceAccount The ProviderServiceAccount to use.
	 * @returns An object with the success status, message, and terraform state.
	 */
	public async destroy(
		cluster: ProviderCluster,
		serviceAccount: ProviderServiceAccount
	): Promise<{
		success: boolean;
		message?: unknown;
		state?: object;
	}> {
		// Set up temporary directory
		const tempDir = await this.setupTmpDir(cluster, serviceAccount);
		if (!tempDir) {
			return { success: false, message: 'Cluster could not be retrieved.' };
		}

		let error;

		try {
			// Terraform destroy
			await SystemUtils.executeCommands(tempDir, 'terraform destroy -auto-approve');
		} catch (e) {
			// We catch the error here so we can store the state file in the db.
			// Even if the destroy fails, the cluster may be partially updated / destroyed,
			// so we want the state file to reflect that.
			const commandError = e as CommandExecutionError;
			error = commandError.stderr ?? commandError.error;
		}

		// Store state file in db under cluster entry
		const state = await SystemUtils.readJsonFromFile(path.join(tempDir, 'terraform.tfstate'));

		// Remove temporary directory
		SystemUtils.removeDir(tempDir);

		if (error) {
			return { success: false, message: error, state };
		}
		return { success: true, message: 'Cluster destroyed successfully', state };
	}
}
