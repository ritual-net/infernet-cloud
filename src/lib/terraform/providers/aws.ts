import { ProviderTypeEnum } from '$/types/provider';
import { BaseTerraform } from '$/lib/terraform/base';
import { createTerraformVarsFile } from '$/lib/terraform/utils';
import type { AWSCluster, AWSServiceAccount } from '$schema/interfaces';

export class AWSTerraform extends BaseTerraform {
	public readonly type = ProviderTypeEnum.AWS;

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

		// Format nodes as a map of node id to node name
		const nodes = Object.fromEntries(cluster.nodes.map((node) => [node.id, node.id]));

		await createTerraformVarsFile(tempDir, {
			nodes,
			name: cluster.id,
			deploy_router: cluster.deploy_router,
			ip_allow_http: cluster.ip_allow_http,
			ip_allow_ssh: cluster.ip_allow_ssh,
			region: cluster.region,
			machine_type: cluster.machine_type,
			access_key_id: credentials.access_key_id,
			secret_access_key: credentials.secret_access_key,

			// defaulted
			image: 'ami-07b36ea9852e986ad',
			ip_allow_http_from_port: 4000,
			ip_allow_http_to_port: 4000,
			is_production: true,
		});
	}
}
