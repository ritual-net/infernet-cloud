import { e } from '$/lib/db';
import { getClusterById } from '../db/queries';
import { routerAction } from '$/lib/clients/node/common';
import { ProviderTerraform } from '$/lib';
import type { Client } from 'edgedb';
import type { ProviderServiceAccount } from '$/types/provider';
import { NodeAction } from '$/types/provider';
import { TFAction } from '$/types/terraform';

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
	const cluster = await getClusterById(client, clusterId, {
		includeServiceAccountCredentials: true,
		includeNodeDetails: true,
		includeDockerAccountCredentials: true,
	});

	if (!cluster)
		throw new Error(`Cluster not found.`)

	if (action === TFAction.Apply && cluster.locked)
		throw new Error(`The cluster is already in the process of being updated. Please wait and try again.`)

	try {
		// Lock the cluster to prevent concurrent mutations
		await e
			.update(e.Cluster, () => ({
				filter_single: { id: clusterId },
				set: {
					locked: true,
				},
			}))
			.run(client)

		// Perform Terraform action
		const {
			error,
			tfstate,
			stdout,
			stderr,
		} = await (
			ProviderTerraform[cluster.service_account.provider]
				.action(
					cluster,
					cluster.service_account as ProviderServiceAccount,
					action
				)
		)

		// Store state in the database
		const deployment = await e
			.insert(e.TerraformDeployment, {
				cluster: e.select(e.Cluster, () => ({
					filter_single: { id: clusterId },
				})),
				error,
				tfstate,
				stdout,
				stderr,
			})
			.run(client)

		// Restart router to apply any changes to IP address list
		if (cluster.deploy_router && action == TFAction.Apply && tfstate?.outputs?.router?.value) {
			await routerAction(client, tfstate.outputs.router.value.id, NodeAction.restart);
		}

		// Update node provider IDs
		const nodeInfo = tfstate?.outputs?.nodes?.value;
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
				})
		}

		return {
			error,
		}
	}finally{
		// Unlock cluster
		await e
			.update(e.Cluster, () => ({
				filter_single: { id: clusterId },
				set: {
					locked: false,
				},
			}))
			.run(client)
	}
}
