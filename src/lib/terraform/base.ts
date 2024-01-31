import path from 'path';
import { client, e } from '$/lib/db';
import * as SystemUtils from '$/lib/utils/system';
import * as TerraformUtils from '$/lib/utils/terraform';
import type { CommandExecutionError } from '$/types/error';
import type { ProviderCluster, ProviderServiceAccount, ProviderTypeEnum } from '$/types/provider';
import { TFAction } from '$/types/terraform';

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
		if (!tempDir) {
			return { success: false, error: 'Cluster could not be updated.', state: {} };
		}

		let error;
		try {
			// Terraform action
			const result = await SystemUtils.executeCommands(
				tempDir,
				`terraform ${action} -auto-approve`
			);

			if (action === TFAction.Apply) {
				const nodeInfo = TerraformUtils.parseTerraformOutput(result);
				console.log(nodeInfo);
				const query = e.params(
					{
						nodeInfo: e.array(
							e.tuple({
								id: e.str,
								key: e.uuid,
							})
						),
					},
					(params) => {
						return e.for(e.array_unpack(params.nodeInfo), (obj) => {
							return e.update(e.InfernetNode, () => ({
								filter_single: { id: obj.key },
								set: {
									provider_id: obj.id,
								},
							}));
						});
					}
				);

				await query.run(client, {
					nodeInfo: nodeInfo.map(({ id, key }) => ({ id: String(id), key: String(key) })),
				});
			}
			// TODO: maybe use name postfix (i.e. db id) for finding nodes in the db
			// TODO: Store nodeInfo in db, probably as a json (aws/gcp agnostic?)
		} catch (e) {
			// We catch the error here so we can store the state file in the db.
			// Even if the apply fails, the cluster may be partially created / updated,
			// so we want the state file to reflect that.
			const commandError = e as CommandExecutionError;
			error = commandError.stderr ?? commandError.error ?? commandError;
			console.error(error);
		}

		// Store state file in db under cluster entry
		const state = await SystemUtils.readJsonFromFile(path.join(tempDir, 'terraform.tfstate'));

		// Remove temporary directory
		SystemUtils.removeDir(tempDir);

		return { success: error ? false : true, error, state };
	}
}
