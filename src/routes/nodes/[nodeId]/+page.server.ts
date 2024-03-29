// Actions
import { type Actions, fail, json } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'

export const actions: Actions = {
	start: async ({
		fetch,
		params: { nodeId },
	}) => {
		const response = await fetch(
			resolveRoute('/api/node/[nodeId]/start', { nodeId }),
			{
				method: 'POST',
			},
		)

		if(!response.ok)
			fail(response.status, {
				result: await response.json(),
			})

		const result = await response.json()

		return json(result)
	},

	stop: async ({
		fetch,
		params: { nodeId },
	}) => {
		const response = await fetch(
			resolveRoute('/api/node/[nodeId]/stop', { nodeId }),
			{
				method: 'POST',
			},
		)

		if(!response.ok)
			fail(response.status, {
				result: await response.json(),
			})

		const result = await response.json()

		return json(result)
	},
}
