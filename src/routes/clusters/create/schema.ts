import { z } from 'zod'

export const createNode = () => ({
	id: crypto.randomUUID(),
	isOnchain: true,
})

export const schema = z.object({
	'serviceAccount': z
		.string(),

	'region': z
		.string(),

	'nodes': z
		.array(
			z.object({
				'id': z.string(),
				'isOnchain': z.boolean(),
			})
		)
		.default([
			createNode(),
		]),
})
