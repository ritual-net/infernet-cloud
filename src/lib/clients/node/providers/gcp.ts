import compute, { InstancesClient } from '@google-cloud/compute';
import { ProviderTypeEnum } from '$/types/provider';
import { BaseNodeClient } from '$/lib/clients/node/base';
import type { GCPServiceAccount } from '$schema/interfaces';
import type { NodeInfo } from '$/types/provider';
import type { google } from '@google-cloud/compute/build/protos/protos';

export class GCPNodeClient extends BaseNodeClient {
	client: InstancesClient;

	constructor(credentials: GCPServiceAccount['creds']) {
		super()

		this.client = new compute.InstancesClient({
			projectId: credentials.project_id,
			credentials: {
				client_email: credentials.client_email,
				private_key: credentials.private_key.split(String.raw`\n`).join('\n'),
			},
		});
	}

	/**
	 * Get the type of provider this client is for.
	 *
	 * @returns provider type (gcp)
	 */
	type(): ProviderTypeEnum {
		return ProviderTypeEnum.GCP;
	}

	/**
	 * Start set of GCP infernet nodes.
	 *
	 * @param nodeConfigIds - List of node ids to start
	 * @param args - Additional arguments needed to start nodes (project id, zone)
	 */
	async startNodes(nodeConfigIds: string[], args: object): Promise<void> {
		for (const nodeConfigId of nodeConfigIds) {
			await this.client.start({
				...args,
				instance: this.toInstanceId(nodeConfigId),
			});
		}
	}

	/**
	 * Stop set of GCP infernet nodes.
	 *
	 * @param nodeConfigIds - List of node ids to stop
	 * @param args - Additional arguments needed to stop nodes (project id, zone)
	 */
	async stopNodes(nodeConfigIds: string[], args: object): Promise<void> {
		for (const nodeConfigId of nodeConfigIds) {
			await this.client.stop({
				...args,
				instance: nodeConfigId,
			});
		}
	}

	/**
	 * Restart set of GCP infernet nodes.
	 *
	 * @param nodeConfigIds - List of node ids to restart
	 * @param args - Additional arguments needed to restart nodes (project id, zone)
	 */
	async restartNodes(nodeConfigIds: string[], args: object): Promise<void> {
		await Promise.all(
			nodeConfigIds.map(async (nodeConfigId) => {
				await this.client.reset({
					...args,
					instance: nodeConfigId,
				})
			})
		)
	}

	/**
	 * Get status and ip of set of GCP infernet nodes.
	 *
	 * @param nodeConfigIds - List of node ids to get status and ip of
	 * @param args - Additional arguments needed to get node info (project id, zone)
	 * @returns Flat array of node info objects
	 */
	async getNodesInfo(
		nodeConfigIds: string[],
		args: google.cloud.compute.v1.IGetInstanceRequest,
	): Promise<NodeInfo[]> {
		return Promise.all(
			nodeConfigIds
				.map(async (nodeConfigId, i) => {
					const result = await this.client
						.get({
							...args,
							instance: this.toInstanceId(nodeConfigId),
						})

					return {
						id: this.toInstanceId(nodeConfigId),
						status: result[0]?.status ?? undefined,
						ip: result[0]?.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP ?? undefined,
					}
				})
		)
	}
}
