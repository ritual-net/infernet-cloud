// Schema
import { message, superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Functions
import { resolveRoute } from '$app/paths'


// Actions
import { type Actions, fail } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		params: { nodeId },
		cookies,
	}) => {
		const formData = await superValidate(
			request,
			yup(FormData)
		)

		if (!formData.valid)
			return fail(400, { formData })

		const response = await fetch(
			resolveRoute('/api/node/[nodeId]', { nodeId }),
			{
				method: 'PATCH',
				body: JSON.stringify(formData.data.node),
			}
		)

		if (!response.ok) {
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't update node configuration.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		return flashRedirect(
			303,
			resolveRoute('/nodes/[nodeId]', { nodeId }),
			{
				type: 'success',
				message: {
					title: `Updated node configuration.`,
				},
			},
			cookies,
		)
	},
}
