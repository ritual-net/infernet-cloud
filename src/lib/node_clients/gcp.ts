import compute, { InstancesClient } from '@google-cloud/compute';
import type { BaseNodeClient } from '$lib/node_clients/base';
import { ProviderTypeEnum, GCPInstanceStatus } from '$types/provider';
import type { GCPNodeClientArgs, NodeInfo } from '$types/provider';
import type { GCPServiceAccount } from '$schema/interfaces';

export class GCPNodeClient implements BaseNodeClient {
	client: InstancesClient;

	constructor(credentials: GCPServiceAccount['creds']) {
		this.client = new compute.InstancesClient({
			projectId: credentials.project_id,
			credentials: {
				client_email: credentials.client_email,
				private_key: credentials.private_key!.split(String.raw`\n`).join('\n'),
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
	 * @param ids - List of node ids to start
	 * @param args - Additional arguments needed to start nodes (project id, zone)
	 */
	async startNodes(ids: string[], args: GCPNodeClientArgs): Promise<void> {
		for (const id of ids) {
			await this.client.start({
				...args,
				instance: id,
			});
		}
	}

	/**
	 * Stop set of GCP infernet nodes.
	 *
	 * @param ids - List of node ids to stop
	 * @param args - Additional arguments needed to stop nodes (project id, zone)
	 */
	async stopNodes(ids: string[], args: GCPNodeClientArgs): Promise<void> {
		for (const id of ids) {
			await this.client.stop({
				...args,
				instance: id,
			});
		}
	}

	/**
	 * Get status and ip of set of GCP infernet nodes.
	 *
	 * @param ids - List of node ids to get status and ip of
	 * @param args - Additional arguments needed to get node info (project id, zone)
	 * @returns Flat array of node info objects
	 */
	async getNodesInfo(ids: string[], args: GCPNodeClientArgs): Promise<NodeInfo[]> {
		const nodesInfo: NodeInfo[] = [];
		for (const id of ids) {
			const result = await this.client.get({
				...args,
				instance: id,
			});
			if (result[0].networkInterfaces && result[0].networkInterfaces[0].accessConfigs) {
				nodesInfo.push({
					id: id,
					status: result[0].status as GCPInstanceStatus,
					ip: result[0].networkInterfaces[0].accessConfigs[0].natIP,
					node: null,
				});
			}
		}
		return nodesInfo;
	}
}
