import * as z from 'yup'
import { IpAddressWithMask } from '$/types/stringFormats'

export const Config = z
	.object({
		'name': z
			.string()
			.default('')
			.required(),

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
	})

export const FormData = z
	.object({
		'config': Config,
	})
