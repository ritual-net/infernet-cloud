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
		registry_address: e.Address,
		allowed_sim_errors: e.array(e.str),
		payment_address: e.Address,
		max_gas_limit: e.int64,
		private_key: e.str,
		forward_stats: e.bool,
		snapshot_sync_sleep: e.float32,
		snapshot_sync_batch_size: e.int16,
	}),
	dockerAccountUsername: e.str,
	containers: e.array(
		e.tuple({
			image: e.str,
			container_id: e.str,
			description: e.str,
			external: e.bool,
			allowed_addresses: e.array(e.Address),
			allowed_delegate_addresses: e.array(e.Address),
			allowed_ips: e.array(e.IpAddress),
			command: e.str,
			env: e.json,
			gpu: e.bool,
			rate_limit_num_requests: e.int64,
			rate_limit_period: e.float32,
			accepted_payments: e.array(
				e.tuple({
					address: e.Address,
					amount: e.str,
				})
			),
			generates_proofs: e.bool,
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
		registry_address: node.config.registry_address,
		allowed_sim_errors: node.config.allowed_sim_errors,
		payment_address: node.config.payment_address,
		max_gas_limit: node.config.max_gas_limit,
		private_key: node.config.private_key,
		forward_stats: node.config.forward_stats,
		snapshot_sync_batch_size: node.config.snapshot_sync_batch_size,
		snapshot_sync_sleep: node.config.snapshot_sync_sleep,
		docker_account: e.select(e.DockerAccount, () => ({
			filter_single: {
				user: e.global.current_user,
				username: node.dockerAccountUsername,
			},
		})),
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
				rate_limit_num_requests: container.rate_limit_num_requests,
				rate_limit_period: container.rate_limit_period,
				accepted_payments: e.for(container.accepted_payments, payment => e.tuple([
					payment.address,
					e.to_bigint(payment.amount),
				])),
				generates_proofs: container.generates_proofs,
			})
		),
	});
};

/**
 * Generic params for selecting a Cluster
 * 
 * @returns The select params
 */
export const getClusterSelectParams = (
	provider: CloudProvider,
	{
		includeServiceAccountCredentials = false,
		includeNodeDetails = true,
		includeDockerAccountCredentials = false,
	}: {
		/**
		 * Whether to include sensitive Service Account credentials
		 */
		includeServiceAccountCredentials?: boolean,

		/**
		 * Whether to include Node and Container details
		 */
		includeNodeDetails?: boolean,

		/**
		 * Whether to include Docker Credentials from Nodes
		 */
		includeDockerAccountCredentials?: boolean,
	}
) => {
	return {
		service_account: {
			user: {
				identity: {
					...e.ext.auth.Identity['*'],
				},
				...e.User['*'],
			},
			...e.ServiceAccount['*'],
			...(includeServiceAccountCredentials && {
				...e.is(ServiceAccountTypeByProvider[provider], { creds: true })
			}),
		},
		nodes: (
			includeNodeDetails
				? {
					...e.InfernetNode['*'],
					...(includeDockerAccountCredentials && {
						docker_account: {
							username: true,
							password: true,
						},
					}),
					containers: {
						...e.Container['*'],
					},
				}
				: {
					id: true,
				}
		),
		...e.Cluster['*'],
		...ClusterSpreadParamsByProvider[provider],
	};
};
