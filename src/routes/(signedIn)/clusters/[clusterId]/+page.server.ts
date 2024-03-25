// Actions
import { type Actions, fail } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'
import { message } from 'sveltekit-superforms/server'

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

		if(!response.ok){
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't delete cluster.`,
					description: result,
				},
				{
					status: response.status,
				}
			)
		}

		const result = await response.json()

		return message(
			{},
			{
				title: `Deleted cluster.`,
				description: result,
			},
			{
				status: response.status,
			}
		)
	},
}
