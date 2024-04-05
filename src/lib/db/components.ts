import { ClusterSpreadParamsByProvider, ServiceAccountTypeByProvider, e } from '.';
import type { $expr_ForVar } from '$schema/edgeql-js/for';
import type { $expr_Param } from '$schema/edgeql-js/params';
import type { CloudProvider } from '$schema/interfaces';

/**
 * Generic params for inserting an InfernetNode
 */
export const createNodeParams = e.tuple({
	config: e.tuple({
		chain_enabled: e.bool,
		trail_head_blocks: e.int16,
		rpc_url: e.str,
		coordinator_address: e.str,
		max_gas_limit: e.int64,
		private_key: e.str,
		forward_stats: e.bool,
	}),
	containers: e.array(
		e.tuple({
			image: e.str,
			container_id: e.str,
			description: e.str,
			external: e.bool,
			allowed_addresses: e.array(e.str),
			allowed_delegate_addresses: e.array(e.str),
			allowed_ips: e.array(e.str),
			command: e.str,
			env: e.json,
			gpu: e.bool,
		})
	),
});

/**
 * Query to insert an InfernetNode
 *
 * @param node The node expression params
 * @returns The insert query
 */
export const insertNodeQuery = (
	node: $expr_ForVar<typeof createNodeParams> | $expr_Param<'node', typeof createNodeParams>
) => {
	return e.insert(e.InfernetNode, {
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
	});
};

/**
 * Generic params for selecting a Cluster
 *
 * @param creds Whether to include sensitive Service Account credentials
 * @returns The select params
 */
export const getClusterSelectParams = (creds: boolean, provider: CloudProvider) => {
	return {
		service_account: {
			user: {
				identity: {
					...e.ext.auth.Identity['*'],
				},
				...e.User['*'],
			},
			...e.ServiceAccount['*'],
			...(creds ? { ...e.is(ServiceAccountTypeByProvider[provider], { creds }) } : {}),
		},
		nodes: {
			id: true,
			// ...e.InfernetNode['*'],
			// containers: {
			// 	...e.Container['*'],
			// },
		},
		...e.Cluster['*'],
		...ClusterSpreadParamsByProvider[provider],
	};
};
