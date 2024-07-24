import { ProviderTypeEnum } from '$/types/provider';
import { BaseTerraform, createTerraformVarsFile } from '$/lib/terraform/base';
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
		const terraformVars = {
			access_key_id: serviceAccount.creds.access_key_id,
			secret_access_key: serviceAccount.creds.secret_access_key,
			region: cluster.region,

			name: `ic-${cluster.id}`,
			is_production: true,
			ip_allow_ssh: cluster.ip_allow_ssh ?? [],
			ip_allow_http: cluster.ip_allow_http ?? [],
			ip_allow_http_from_port: 4000,
			ip_allow_http_to_port: 4000,

			router: {
				deploy: cluster.deploy_router,
				zone: cluster.zone,
				machine_type: cluster.machine_type,
			},

			nodes: Object.fromEntries(
				cluster.nodes
					.map((node) => [
						`infernet-node-${node.id}`,
						{
							zone: `${cluster.region}a`, 
							machine_type: cluster.machine_type,
							image: 'ami-05fb0b8c1424f266b',
							has_gpu: false,

							// zone: node.zone,
							// machine_type: node.machine_type,
							// image: node.has_gpu ? 'ami-0b4750268a88e78e0' : 'ami-05fb0b8c1424f266b',
							// has_gpu: node.has_gpu,
							// gpu_type: node.gpu_type,
							// gpu_count: node.gpu_count,
						}
					])
			),
		}

		console.log({terraformVars})

		await createTerraformVarsFile(tempDir, terraformVars)
	}
}
