import * as z from 'yup'
import { IpWithAddressMask } from '$/types/stringFormats'

export const Config = z
	.object({
		'name': z
			.string()
			.default('')
			.required(),

		'deploy_router': z
			.boolean()
			.default(false)
			.required(),

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
		'config': Config,
	})
