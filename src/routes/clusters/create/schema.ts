import { z } from 'zod'

export const IpWithAddressMask = z
	// .string()
	// .ip()
	.custom<`${number}.${number}.${number}.${number}/${number}`>(
		(value) => /^\d+\.\d+\.\d+\.\d+\/\d+$/g.test(value as string)
	)

export const Config = z
	.object({
		'name': z
			.string()
			.default(''),

		'deploy_router': z
			.boolean()
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
			.default(''),

		'machine_type': z
			.string()
			.default(''),
	})

export const Container = z
	.object({
		'image': z
			.string()
			.default(''),

		'container_id': z
			.string()
			.default(() => (
				crypto.randomUUID()
			)),

		'description': z
			.string()
			.default(''),

		'external': z
			.boolean()
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
				z
					.string()
					.ip()
			)
			.default([]),

		'command': z
			.string()
			.default(''),

		'env': z
			.string()
			.default(''),

		'gpu': z
			.boolean()
			.default(false),
	})

export const Node = z.object({
	'id': z
		.string()
		.uuid()
		.default(() => (
			crypto.randomUUID()
		)),

	'chain_enabled': z
		.boolean()
		.default(false),

	'trail_head_blocks': z
		.number()
		.default(5),

	'rpc_url': z
		.string()
		.url()
		.or(z.literal(''))
		.default(''),

	'coordinator_address': z
		.string()
		.default(''),

	'max_gas_limit': z
		.number()
		.int()
		.positive()
		.default(5000000),

	'private_key': z
		.string()
		.default(''),

	'forward_stats': z
		.boolean()
		.default(true),

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

		'config': Config
			.default(() => (
				Config.parse({})
			)),

		'nodes': z
			.array(
				Node,
			)
			.default(() => (
				[
					Node.parse({}),
				]
			)),
	})
