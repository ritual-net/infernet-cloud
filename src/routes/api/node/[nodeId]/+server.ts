import { ProviderTerraform } from '$lib';
import { QueryByProvider, client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns Node object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get node by id
	const result = await e
		.select(e.InfernetNode, () => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter_single: { id },
		}))
		.run(client);

	return json(result);
};

/**
 * Delete a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns { id: string, success: boolean, message: string} - Node id, success
 * 		boolean, and Terraform message.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get cluster id and provider
	const node = e.select(e.InfernetNode, () => ({
		filter_single: { id },
	}));

	const clusters = await e
		.with(
			[node],
			e.select(e.Cluster, (cluster) => ({
				id: true,
				service_account: {
					id: true,
					provider: true,
				},
				filter: e.op(node, 'in', cluster.nodes),
			}))
		)
		.run(client);

	if (clusters.length !== 1) {
		return error(400, 'Cluster could not be retrieved');
	}

	const cluster = clusters[0];
	const provider = cluster.service_account.provider;

	// Delete node
	const deleteNodeQuery = e.delete(e.InfernetNode, () => ({
		filter_single: { id: e.uuid(id) },
	}));
	await e
		.with(
			[deleteNodeQuery],
			e.update(e.Cluster, () => ({
				filter_single: { id: cluster.id },
				set: {
					nodes: { '-=': deleteNodeQuery },
				},
			}))
		)
		.run(client);

	// Terraform apply
	// TODO: Perhaps factor out the following, repeated > 3 times
	const clusterData = await QueryByProvider[provider].getClusterById(cluster.id);
	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(
		cluster.service_account.id
	);
	if (!clusterData || !serviceAccount) {
		return error(404, 'Cluster not found');
	}

	const { success, message, state } = await ProviderTerraform[provider].apply(
		clusterData,
		serviceAccount
	);

	await e
		.update(e.Cluster, () => ({
			filter_single: { id: cluster.id },
			set: {
				tfstate: JSON.stringify(state),
			},
		}))
		.run(client);

	if (success) {
		return json({ id, success, message: 'Node deleted successfully' });
	}

	return json({ id, success, message });
};
