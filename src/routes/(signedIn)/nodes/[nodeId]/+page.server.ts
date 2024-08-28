// Actions
import { type Actions, fail, json } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'
import { message } from 'sveltekit-superforms/server'

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

		if(!response.ok){
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't start node.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.text()

		return message(
			{},
			{
				title: `Started node.`,
				description: result,
			},
			{
				status: response.status,
			},
		)
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

		if(!response.ok){
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't stop node.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.text()

		return message(
			{},
			{
				title: `Stopped node.`,
				description: result,
			},
			{
				status: response.status,
			},
		)
	},
}
