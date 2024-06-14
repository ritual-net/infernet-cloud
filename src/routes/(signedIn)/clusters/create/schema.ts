import * as z from 'yup'
import { IpAddressWithMask, Address, Secp256k1PrivateKey, BigIntString } from '$/types/stringFormats'

export const Config = z
	.object({
		'name': z
			.string()
			.required(),

		'deploy_router': z
			.boolean()
			.required()
			.default(false),

		'ip_allow_http': z
			.array(
				IpAddressWithMask
			)
			.default([]),

		'ip_allow_ssh': z
			.array(
				IpAddressWithMask
			)
			.default([]),

		'region': z
			.string()
			.required(),

		'zone': z
			.string()
			.optional(),

		'machine_type': z
			.string()
			.required(),
	})

export const ContainerPayment = z
	.object({
		'address': Address
			.required(),

		'amount': BigIntString
			.required(),
	})

export const Container = z
	.object({
		'id': z
			.string()
			.optional()
			.default(() => (
				crypto.randomUUID()
			)),

		'image': z
			.string()
			.required(),

		'container_id': z
			.string()
			.required(),

		'description': z
			.string()
			.optional()
			.default(''),

		'external': z
			.boolean()
			.required()
			.default(true),

		'allowed_addresses': z
			.array(
				Address
			)
			.optional()
			.default([]),

		'allowed_delegate_addresses': z
			.array(
				Address
			)
			.optional()
			.default([]),

		'allowed_ips': z
			.array(
				IpAddressWithMask
			)
			.optional()
			.default([]),

		'command': z
			.string()
			.optional()
			.default(''),

		'env': z
			.object()
			.optional()
			.default({}),

		'gpu': z
			.boolean()
			.required()
			.default(false),

		'rate_limit_num_requests': z
			.number()
			.integer()
			.positive()
			.optional(),

		'rate_limit_period': z
			.number()
			.positive()
			.optional(),

		'accepted_payments': z
			.array(
				ContainerPayment,
			)
			.optional(),

		'generates_proofs': z
			.boolean()
			.required()
			.default(false),
	})

export const NodeConfig = z
	.object({
		'chain_enabled': z
			.boolean()
			.required()
			.default(false),

		'trail_head_blocks': z
			.number()
			.positive()
			.optional(),

		'rpc_url': z
			.string()
			.url()
			.default('')
			.when(
				'chain_enabled',
				([chain_enabled]: boolean[], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

		'registry_address':
			Address
			.when(
				'chain_enabled',
				([chain_enabled], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

		'max_gas_limit': z
			.number()
			.integer()
			.positive()
			.optional()
			.nullable(),

		'private_key':
			Secp256k1PrivateKey
			.when(
				'chain_enabled',
				([chain_enabled], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

		'payment_address': Address
			.optional(),

		'allowed_sim_errors': z
			.array(
				z
					.string()
			)
			.optional(),

		'forward_stats': z
			.boolean()
			.required()
			.default(false),
		
		'snapshot_sync_sleep': z.
			number()
			.positive(),
				
		'snapshot_sync_batch_size': z
			.number()
			.positive()
			.integer(),
	})

export const Node = z
	.object({
		'id': z
			.string()
			.uuid()
			.default(() => (
				crypto.randomUUID()
			)),

		'config': NodeConfig,

		'dockerAccountUsername': z
			.string()
			.default('')
			.optional(),

		'containers': z
			.array(
				Container
			)
			.default(
				[]
			),
	})

export const FormData = z
	.object({
		'serviceAccountId': z
			.string()
			.uuid(),

		'config': Config,

		'nodes': z
			.array(
				Node,
			)
			.default(() => (
				[
					Node.getDefault(),
				]
			)),
	})


// EdgeDB doesn't yet allow optional values within tuples.
// https://github.com/edgedb/edgedb/issues/5778
// https://github.com/edgedb/rfcs/blob/master/text/1022-freetypes.rst
// Manually initialize `undefined` keys omitted from JSON serialization
// to satisfy `e.tuple`s within `e.params()`
export const setDefaultNodeValues = (node: z.InferType<typeof Node>) => {
	node.config.trail_head_blocks ??= 5
	node.config.rpc_url ??= ''
	node.config.registry_address ??= ''
	node.config.max_gas_limit ??= 5000000
	node.config.private_key ??= ''
	node.config.payment_address ??= ''
	node.config.allowed_sim_errors ??= []
	node.config.snapshot_sync_sleep ??= 1.0
	node.config.snapshot_sync_batch_size ??= 200
	node.dockerAccountUsername ??= ''
}
