import { ClusterSpreadParamsByProvider, ServiceAccountTypeByProvider, e } from '.'
import type { $expr_ForVar } from '$schema/edgeql-js/for'
import type { $expr_Param } from '$schema/edgeql-js/params'
import type { CloudProvider } from '$schema/interfaces'
import type { $json } from '$schema/edgeql-js/modules/std'

/**
 * Generic params for inserting an InfernetNode
 */
export const createNodeParams = e.tuple({
	config: e.tuple({
		region: e.str,
		zone: e.str,
		machine_type: e.str,
		machine_image: e.str,
		chain_enabled: e.bool,
		trail_head_blocks: e.int16,
		rpc_url: e.str,
		chain_id: e.int64,
		registry_address: e.Address,
		allowed_sim_errors: e.array(e.str),
		payment_address: e.Address,
		max_gas_limit: e.int64,
		private_key: e.str,
		forward_stats: e.bool,
		snapshot_sync_sleep: e.float32,
		snapshot_sync_batch_size: e.int16,
		snapshot_sync_starting_sub_id: e.int32,
		snapshot_sync_sync_period: e.float32,
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
					amount: e.BigIntString,
				}),
			),
			generates_proofs: e.bool,
		}),
	),
})

/**
 * Query to insert an InfernetNode
 *
 * @param node The node expression params
 * @returns Fields to pass to an insert or update query
 */
export const nodeQueryFields = (
	node: $expr_ForVar<typeof createNodeParams> | $expr_Param<'node', typeof createNodeParams>,
) => ({
	region: node.config.region,
	zone: node.config.zone,
	machine_type: node.config.machine_type,
	machine_image: node.config.machine_image,
	chain_enabled: node.config.chain_enabled,
	trail_head_blocks: node.config.trail_head_blocks,
	rpc_url: node.config.rpc_url,
	chain_id: node.config.chain_id,
	registry_address: node.config.registry_address,
	allowed_sim_errors: node.config.allowed_sim_errors,
	payment_address: node.config.payment_address,
	max_gas_limit: node.config.max_gas_limit,
	private_key: node.config.private_key,
	forward_stats: node.config.forward_stats,
	snapshot_sync_batch_size: node.config.snapshot_sync_batch_size,
	snapshot_sync_sleep: node.config.snapshot_sync_sleep,
	snapshot_sync_starting_sub_id: node.config.snapshot_sync_starting_sub_id,
	snapshot_sync_sync_period: node.config.snapshot_sync_sync_period,
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
			accepted_payments: container.accepted_payments,
			// accepted_payments: e.for(container.accepted_payments, payment => e.tuple([
			// 	payment.address,
			// 	e.to_bigint(payment.amount),
			// ])),
			generates_proofs: container.generates_proofs,
		}),
	),
}) as const

export const nodeJsonQueryFields = (node: $expr_ForVar<$json> | $expr_Param<'node', $json>) => ({
	region: e.cast(e.str, e.json_get(node, 'config', 'region')),
	zone: e.cast(e.str, e.json_get(node, 'config', 'zone')),
	machine_type: e.cast(e.str, e.json_get(node, 'config', 'machine_type')),
	machine_image: e.cast(e.str, e.json_get(node, 'config', 'machine_image')),
	chain_enabled: e.cast(e.bool, e.json_get(node, 'config', 'chain_enabled')),
	trail_head_blocks: e.cast(e.int16, e.json_get(node, 'config', 'trail_head_blocks')),
	rpc_url: e.cast(e.str, e.json_get(node, 'config', 'rpc_url')),
	chain_id: e.cast(e.int64, e.json_get(node, 'config', 'chain_id')),
	registry_address: e.cast(e.Address, e.json_get(node, 'config', 'registry_address')),
	allowed_sim_errors: e.cast(
		e.array(e.str),
		e.json_get(node, 'config', 'allowed_sim_errors'),
	),
	payment_address: e.cast(e.Address, e.json_get(node, 'config', 'payment_address')),
	max_gas_limit: e.cast(e.int64, e.json_get(node, 'config', 'max_gas_limit')),
	private_key: e.cast(e.str, e.json_get(node, 'config', 'private_key')),
	forward_stats: e.cast(e.bool, e.json_get(node, 'config', 'forward_stats')),
	snapshot_sync_batch_size: e.cast(
		e.int16,
		e.json_get(node, 'config', 'snapshot_sync_batch_size'),
	),
	snapshot_sync_sleep: e.cast(e.float32, e.json_get(node, 'config', 'snapshot_sync_sleep')),
	snapshot_sync_starting_sub_id: e.cast(
		e.int32,
		e.json_get(node, 'config', 'snapshot_sync_starting_sub_id'),
	),
	snapshot_sync_sync_period: e.cast(
		e.float32,
		e.json_get(node, 'config', 'snapshot_sync_sync_period'),
	),
	docker_account: e.select(e.DockerAccount, () => ({
		filter_single: {
			user: e.global.current_user,
			username: e.cast(e.str, e.json_get(node, 'dockerAccountUsername')),
		},
	})),
	containers: e.for(e.json_array_unpack(e.json_get(node, 'containers')), (container) =>
		e.insert(e.Container, {
			image: e.cast(e.str, e.json_get(container, 'image')),
			container_id: e.cast(e.str, e.json_get(container, 'container_id')),
			description: e.cast(e.str, e.json_get(container, 'description')),
			external: e.cast(e.bool, e.json_get(container, 'external')),
			allowed_addresses: e.cast(
				e.array(e.Address),
				e.json_get(container, 'allowed_addresses'),
			),
			allowed_delegate_addresses: e.cast(
				e.array(e.Address),
				e.json_get(container, 'allowed_delegate_addresses'),
			),
			allowed_ips: e.cast(e.array(e.IpAddress), e.json_get(container, 'allowed_ips')),
			command: e.cast(e.str, e.json_get(container, 'command')),
			env: e.cast(e.json, e.json_get(container, 'env')),
			gpu: e.cast(e.bool, e.json_get(container, 'gpu')),
			rate_limit_num_requests: e.cast(
				e.int64,
				e.json_get(container, 'rate_limit_num_requests'),
			),
			rate_limit_period: e.cast(e.float32, e.json_get(container, 'rate_limit_period')),
			accepted_payments: e.cast(
				e.array(
					e.tuple({
						address: e.Address,
						amount: e.BigIntString,
					}),
				),
				e.json_get(container, 'accepted_payments'),
			),
			generates_proofs: e.cast(e.bool, e.json_get(container, 'generates_proofs')),
		}),
	),
}) as const

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
		includeTerraformDeploymentDetails = false,
	}: {
		/**
		 * Whether to include sensitive Service Account credentials
		 */
		includeServiceAccountCredentials?: boolean

		/**
		 * Whether to include Node and Container details
		 */
		includeNodeDetails?: boolean

		/**
		 * Whether to include Docker Credentials from Nodes
		 */
		includeDockerAccountCredentials?: boolean

		/**
		 * Whether to include Terraform deployment details
		 */
		includeTerraformDeploymentDetails?: boolean
	},
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
				...e.is(ServiceAccountTypeByProvider[provider], { creds: true }),
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

		...(includeTerraformDeploymentDetails && {
			deployments: deployment => ({
				...e.TerraformDeployment['*'],
				order_by: {
					expression: deployment.timestamp,
					direction: e.DESC,
				},
			}),
			latest_deployment: {
				...e.TerraformDeployment['*'],
			},
		}),
	}
}
