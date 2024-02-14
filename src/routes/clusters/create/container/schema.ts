import { z } from 'zod'

import { Container } from '../schema'

export { Container } from '../schema'

export const FormData = z
	.object({
		'container': Container
			.default(() => (
				Container.parse({})
			)),
	})
