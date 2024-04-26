import * as z from 'yup'

export const Ip = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\$/)
	.defined()

export const IpWithAddressMask = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\/\d+$/)
	.defined()

export const Address = z
	.string<`0x${string}`>()
	.matches(/^0x[0-9a-f]{40}$/i)
	.defined()
