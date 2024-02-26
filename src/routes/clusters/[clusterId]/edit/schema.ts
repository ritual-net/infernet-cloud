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
	})

export const FormData = z
	.object({
		'config': Config
			.default(() => (
				Config.parse({})
			)),
	})
