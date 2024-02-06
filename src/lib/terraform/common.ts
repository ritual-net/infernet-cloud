import { e } from '$/lib/db';
import { getClusterById } from '../db/queries';
import { ProviderTerraform } from '$/lib';
import type { Client } from 'edgedb';
import type { ProviderServiceAccount } from '$/types/provider';
import type { TFAction } from '$/types/terraform';

/**
 * Applies the given action to a cluster, and persists the resulting Terraform state
 * in the database.
 *
 * @param client The database client
 * @param clusterId The id of the Cluster
 * @param action The Terraform action
 * @returns An object with the success status and (optional) error message
 */
export async function clusterAction(client: Client, clusterId: string, action: TFAction) {
	const cluster = await getClusterById(client, clusterId, true);
	if (!cluster) {
		return { error: 'Cluster not found', success: false };
	}
	console.log(cluster);
	const { error, nodeInfo, state, success } = await ProviderTerraform[
		cluster.service_account.provider
	].action(cluster, cluster.service_account as ProviderServiceAccount, action);
	console.log(nodeInfo);
	// Store state in the database
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				tfstate: JSON.stringify(state),
				//router_ip: String(nodeInfo![0].router_ip),
			},
		}))
		.run(client);

	// Update node provider IDs
	if (nodeInfo) {
		await e
			.params(
				{
					nodeInfo: e.array(
						e.tuple({
							id: e.str,
							key: e.uuid,
						})
					),
				},
				(params) =>
					e.for(e.array_unpack(params.nodeInfo), (obj) =>
						e.update(e.InfernetNode, () => ({
							filter_single: { id: obj.key },
							set: {
								provider_id: obj.id,
							},
						}))
					)
			)
			.run(client, {
				nodeInfo: nodeInfo.map(({ id, key }) => ({ id: String(id), key: String(key) })),
			});
	}

	return { error, success };
}
