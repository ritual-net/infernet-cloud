import { Container } from '../../clusters/create/schema'
import * as z from 'yup'

export const FormData = z
	.object({
		'chain_enabled': z
			.boolean()
			.default(false),

		'dockerAccountUsername': z
			.string()
			.optional(),

		'container': Container,
	})
