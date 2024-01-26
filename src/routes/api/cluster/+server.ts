import { error, json } from '@sveltejs/kit';
import { QueryByProvider, client, e } from '$lib/db';
import { createNodeParams, getProviderByServiceAccountId } from '$lib/db/common';
import { ProviderTerraform } from '$lib';
import type { RequestHandler } from '@sveltejs/kit';
import type { Cluster } from '$schema/interfaces';

/**
 * Fetch all clusters for a user.
 *
 * @param request - The request object containing 'user'.
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async ({ request }) => {
	const url = new URL(request.url);
	const user = url.searchParams.get('user');

	if (!user) {
		return error(400, 'User id is required');
	}
	// TODO: Get user id from auth

	// Get all clusters for user
	const result = await e
		.select(e.Cluster, (cluster) => ({
			service_account: {
				name: true,
				provider: true,
			},
			id: true,
			name: true,
			node_count: e.count(cluster.nodes),
			filter: e.op(cluster.service_account.user.id, '=', e.uuid(user)),
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param request - The request object containing 'serviceAccountId', 'config', 'nodes'.
 * @returns Cluster object ID, success boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { serviceAccountId, config, nodes } = await request.json();

	if (!serviceAccountId || !config || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required');
	}

	// TODO: Make sure service account belongs to user through auth

	// TODO: Enforce correctness of config, nodes + containers?

	// Get provider of service account
	const provider = await getProviderByServiceAccountId(serviceAccountId);
	if (!provider) {
		return error(400, 'Service account could not be retrieved');
	}

	// Create cluster
	const cluster = (await e
		.params(
			{
				nodes: e.array(createNodeParams),
			},
			({ nodes }) =>
				// Choose cluster type based on provider
				QueryByProvider[provider].insertClusterQuery(
					config,
					serviceAccountId,
					e.for(e.array_unpack(nodes), (node) =>
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
		)
		.run(client, { nodes })) as Cluster;

	if (!cluster) {
		return error(500, 'Failed to create cluster');
	}

	const clusterData = await QueryByProvider[provider].getClusterById(cluster.id);
	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(serviceAccountId);

	if (!clusterData || !serviceAccount) {
		return error(500, 'Failed to fetch cluster and credentials from database');
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

	return json({ id: cluster.id, success, message });
};
