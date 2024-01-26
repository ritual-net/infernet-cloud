import { ProviderTerraform } from '$lib';
import { QueryByProvider, client, e } from '$lib/db';
import { createNodeParams, getProviderByClusterId } from '$lib/db/common';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Add a node to a cluster.
 *
 * @param request - The request object containing 'node' and 'cluster_id'.
 * @returns { id: string, success: boolean, message: string} - Node id, success
 *      boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ request }) => {
	// TODO: Make sure cluster belongs to user through auth

	const { node, cluster_id: clusterId } = await request.json();
	if (!node || !clusterId) {
		return error(400, 'Data and cluster id are required');
	}

	const provider = await getProviderByClusterId(clusterId);
	if (!provider) {
		return error(400, 'Cluster could not be retrieved');
	}

	// Create node and update cluster
	await e
		.params(
			{
				node: createNodeParams,
			},
			({ node }) =>
				QueryByProvider[provider].insertNodeToClusterQuery(
					clusterId,
					e.insert(e.InfernetNode, {
						chain_enabled: node.config.chain_enabled,
						trail_head_blocks: node.config.trail_head_blocks,
						rpc_url: node.config.rpc_url,
						coordinator_address: node.config.coordinator_address,
						max_gas_limit: node.config.max_gas_limit,
						private_key: node.config.private_key,
						forward_stats: node.config.forward_stats,
						containers: e.for(e.array_unpack(node.containers), (container) =>
							e.insert(e.Container, {
								image: container.image,
								container_id: container.container_id,
								description: container.description,
								external: container.external,
								allowed_addresses: container.allowed_addresses,
								allowed_delegate_addresses: container.allowed_delegate_addresses,
								allowed_ips: container.allowed_ips,
								command: container.command,
								env: container.env,
								gpu: container.gpu,
							})
						),
					})
				)
		)
		.run(client, { node });

	// Terraform apply
	// TODO: Perhaps factor out the following, repeated > 3 times
	const clusterData = await QueryByProvider[provider].getClusterById(clusterId);
	if (!clusterData) {
		return error(404, 'Cluster not found');
	}

	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(
		clusterData.service_account.id
	);

	if (!serviceAccount) {
		return error(404, 'Service Account not found');
	}

	const { success, message, state } = await ProviderTerraform[provider].apply(
		clusterData,
		serviceAccount
	);

	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				tfstate: JSON.stringify(state),
			},
		}))
		.run(client);

	if (success) {
		return json({ id: clusterId, success, message: 'Node created successfully' });
	}
	return json({ id: clusterId, success, message });
};
