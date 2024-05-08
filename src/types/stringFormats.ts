import * as z from 'yup'

export const Ip = z
	.string<`${number}.${number}.${number}.${number}`>()
	.matches(/^(?:(?:25[0-5]|(?:2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/)
	.defined()

export const IpWithAddressMask = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^(?:(?:25[0-5]|(?:2[0-4]|1\d|[1-9]|)\d)\.?\b){4}(?:\/(3[0-2]|[1-2]?\d))?$/)
	.defined()

export const Address = z
	.string<`0x${string}`>()
	.matches(/^0x[0-9a-f]{40}$/i)
	.defined()
