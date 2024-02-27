import { e } from '$/lib/db';
import { getClusterById } from '../db/queries';
import { nodeAction } from '$/lib/clients/node/common';
import { ProviderTerraform } from '$/lib';
import type { Client } from 'edgedb';
import type { ProviderServiceAccount } from '$/types/provider';
import { NodeAction } from '$/types/provider';
import { TFAction } from '$/types/terraform';
import { c } from 'tar';

/**
 * Applies the given action to a cluster, and persists the resulting Terraform state
 * in the database.
 *
 * @param client The database client
 * @param clusterId The id of the Cluster
 * @param action The Terraform action
 * @returns An object with the success status and (optional) error message
 */
export const clusterAction = async (client: Client, clusterId: string, action: TFAction) => {
	const cluster = await getClusterById(client, clusterId, true);
	if (!cluster) {
		return { error: 'Cluster not found', success: false };
	}

	if (cluster.locked) {
		return { error: 'Cluster mutation is progress. Please wait.', success: false };
	}

	// Lock the cluster to prevent concurrent mutations
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				locked: true,
			},
		}))
		.run(client);

	const { error, state, success } = await ProviderTerraform[
		cluster.service_account.provider
	].action(cluster, cluster.service_account as ProviderServiceAccount, action);
    console.log("new", state)
	// Store state in the database
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				error: error ?? null,
				healthy: success,
				locked: false,
				router: {
                    id: state?.outputs?.router?.value?.id ?? "",
					ip: state?.outputs?.router?.value?.ip ?? "",
				},
				tfstate: JSON.stringify(state),
			},
		}))
		.run(client);

    // If successful, then restart router
    if (success && cluster.deploy_router) {
        const router_id = cluster.router!.id;
        //await nodeAction(client, [router_id], NodeAction.restart);
        console.log(`Router ${router_id} restarted`);
    }
	// Update node provider IDs
	const nodeInfo = state?.outputs?.nodes?.value;
	if (nodeInfo) {
		await e
			.params(
				{
					nodeInfo: e.array(
						e.tuple({
							id: e.str,
							ip: e.str,
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
				nodeInfo,
			});
	}
	return { error, success };
};
