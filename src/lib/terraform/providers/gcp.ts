import path from 'path';
import { BaseTerraform, createTerraformVarsFile } from '$/lib/terraform/base';
import { ProviderTypeEnum } from '$/types/provider';
import * as SystemUtils from '$/lib/utils/system';
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
		const terraformVars = {
			gcp_credentials_file_path: 'ritual-deployer-key.json',
			service_account_email: serviceAccount.creds.client_email,
			project: serviceAccount.creds.project_id,

			name: cluster.provider_id,
			is_production: true,
			ip_allow_ssh: cluster.ip_allow_ssh ?? [],
			ip_allow_http: cluster.ip_allow_http ?? [],
			ip_allow_http_ports: ["4000"],

			router: (	
				cluster.router ?
					{
						deploy: true,
						region: cluster.router.region,
						zone: cluster.router.zone,
						machine_type: cluster.router.machine_type,
					}
				:
					{
						deploy: false,
						region: '',
						zone: '',
						machine_type: '',
					}
			),

			nodes: Object.fromEntries(
				cluster.nodes.map((node, i) => [
					node.provider_id,
					{
						region: node.region || cluster.region,
						zone: node.zone || cluster.zone,
						machine_type: node.machine_type,
						image: 'ubuntu-2004-focal-v20231101',

						// image: node.has_gpu ? 'nvidia-tesla-t4' : 'ubuntu-2004-focal-v20231101',
						// has_gpu: node.has_gpu,
					}
				])
			),
		}

		await createTerraformVarsFile(
			tempDir,
			terraformVars
		)

		// Write service account credentials to file
		await SystemUtils.writeJsonToFile(
			path.join(tempDir, 'ritual-deployer-key.json'),
			{
				...serviceAccount.creds,
				private_key: serviceAccount.creds.private_key.split(String.raw`\n`).join('\n'),
			}
		)
	}
}
