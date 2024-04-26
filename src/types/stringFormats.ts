import * as z from 'yup'

export const Ip = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\$/g)
	.defined()

export const IpWithAddressMask = z
	.string<`${number}.${number}.${number}.${number}/${number}`>()
	.matches(/^\d+\.\d+\.\d+\.\d+\/\d+$/g)
	.defined()
