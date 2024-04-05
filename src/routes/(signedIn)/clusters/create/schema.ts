import * as z from 'yup'

export const Ip = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\$/g)

export const IpWithAddressMask = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\/\d+$/g)

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
				IpWithAddressMask
			)
			.default([]),

		'ip_allow_ssh': z
			.array(
				IpWithAddressMask
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

export const Container = z
	.object({
		'image': z
			.string()
			.required(),

		'container_id': z
			.string()
			.required()
			.default(() => (
				crypto.randomUUID()
			)),

		'description': z
			.string()
			.required(),

		'external': z
			.boolean()
			.required()
			.default(true),

		'allowed_addresses': z
			.array(
				z
					.string()
			)
			.default([]),

		'allowed_delegate_addresses': z
			.array(
				z
					.string()
			)
			.default([]),

		'allowed_ips': z
			.array(
				Ip
			)
			.default([]),

		'command': z
			.string()
			.optional(),

		'env': z
			.string()
			.optional(),

		'gpu': z
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
			.default(5)
			.when(
				'chain_enabled',
				([chain_enabled], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

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

		'coordinator_address': z
			.string()
			.default('')
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
			.default(5000000)
			.when(
				'chain_enabled',
				([chain_enabled], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

		'private_key': z
			.string()
			.default('')
			.when(
				'chain_enabled',
				([chain_enabled], _) => (
					chain_enabled
						? _.required()
						: _.notRequired()
				),
			),

		'forward_stats': z
			.boolean()
			.required()
			.default(false),
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
