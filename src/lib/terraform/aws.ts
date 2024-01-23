import type { AWSCluster, AWSServiceAccount } from '$schema/interfaces';
import { ProviderTypeEnum } from '$lib/types';
import { TerraformUtils } from '$utils/terraform';
import { BaseTerraform } from './base';

export class AWSTerraform extends BaseTerraform {
	/**
	 * Returns the provider type.
	 * @returns ProviderTypeEnum
	 */
	public readonly type = (): ProviderTypeEnum => ProviderTypeEnum.AWS;

	/**
	 * Writes Terraform files to the temporary directory.
	 *
	 * @param tempDir The path to the temporary directory.
	 * @param cluster The AWSCluster to deploy.
	 * @param serviceAccount The AWSServiceAccount to use for deployment.
	 */
	protected override async writeTerraformFiles(
		tempDir: string,
		cluster: AWSCluster,
		serviceAccount: AWSServiceAccount
	): Promise<void> {
		const credentials = serviceAccount.creds;

		await TerraformUtils.createTerraformVarsFile(tempDir, {
			access_key_id: credentials.access_key_id,
			secret_access_key: credentials.secret_access_key,
			region: cluster.region,
			deploy_router: cluster.deploy_router,
			node_count: cluster.nodes.length,
			instance_name: cluster.id,
			machine_type: cluster.machine_type,
			ip_allow_http: cluster.ip_allow_http,
			ip_allow_ssh: cluster.ip_allow_ssh,

			// defaulted
			image: 'ami-07b36ea9852e986ad',
			ip_allow_http_from_port: 4000,
			ip_allow_http_to_port: 4000,
			is_production: true
		});
	}
}
