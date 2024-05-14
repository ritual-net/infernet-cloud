import { Container } from '../../clusters/create/schema'
import * as z from 'yup'

export const ContainerTemplate = Container.concat(
	z.object({
		'name': z
			.string()
			.required(),

		'chain_enabled': z
			.boolean()
			.default(false),
	})
)

export const FormData = z
	.object({
		'dockerAccountUsername': z
			.string()
			.default('')
			.optional(),

		'containerTemplate': ContainerTemplate
			.required(),
	})
