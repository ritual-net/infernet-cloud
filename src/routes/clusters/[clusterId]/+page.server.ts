// Actions
import { type Actions, fail } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'

export const actions: Actions = {
	delete: async ({
		fetch,
		params: { clusterId },
	}) => {
		const response = await fetch(
			resolveRoute('/api/cluster/[clusterId]', { clusterId }),
			{
				method: 'DELETE',
			},
		)

		if(!response.ok)
			return fail(response.status, {
				result: await response.json(),
			})

		const result = await response.json()

		return {
			result,
		}
	},
}
