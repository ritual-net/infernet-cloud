import path from 'path';
import { BaseTerraform } from '$/lib/terraform/base';
import { ProviderTypeEnum } from '$/types/provider';
import * as SystemUtils from '$/lib/utils/system';
import * as TerraformUtils from '$/lib/utils/terraform';
import type { GCPCluster, GCPServiceAccount } from '$schema/interfaces';

export class GCPTerraform extends BaseTerraform {
	public readonly type = ProviderTypeEnum.GCP;

	/**
	 * Writes Terraform files to the temporary directory.
	 *
	 * @param tempDir The path to the temporary directory.
	 * @param cluster The GCPCluster to deploy.
	 * @param serviceAccount The GCPServiceAccount to use for deployment.
	 */
	protected override async writeTerraformFiles(
		tempDir: string,
		cluster: GCPCluster,
		serviceAccount: GCPServiceAccount
	): Promise<void> {
		const credentials = serviceAccount.creds;
		credentials.private_key = credentials.private_key.split(String.raw`\n`).join('\n');

		// Format nodes as a map of node id to node name
		const nodes = Object.fromEntries(cluster.nodes.map((node) => [node.id, node.id]));

		await TerraformUtils.createTerraformVarsFile(tempDir, {
			nodes,
			name: cluster.id,
			deploy_router: cluster.deploy_router,
			ip_allow_http: cluster.ip_allow_http,
			ip_allow_ssh: cluster.ip_allow_ssh,
			region: cluster.region,
			zone: cluster.zone,
			machine_type: cluster.machine_type,
			project: credentials.project_id,
			service_account_email: credentials.client_email,

			// defaulted
			image: 'ubuntu-2004-focal-v20231101',
			ip_allow_http_ports: ['4000'],
			is_production: true,
		});

		// Write service account credentials to file
		await SystemUtils.writeJsonToFile(
			path.join(tempDir, 'terraform-deployer-key.json'),
			credentials
		);
	}
}
