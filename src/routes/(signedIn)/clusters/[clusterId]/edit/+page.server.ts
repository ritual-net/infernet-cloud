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
		params: { clusterId },
		cookies,
	}) => {
		const formData = await superValidate(request, yup(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const response = await fetch(
			resolveRoute('/api/cluster/[clusterId]', { clusterId }),
			{
				method: 'PATCH',
				body: JSON.stringify(formData.data),
			}
		)

		if(!response.ok){
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't update cluster configuration.`,
					description: result,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.json()

		// return message(
		// 	formData,
		// 	{
		// 		title: `Updated cluster configuration.`,
		// 		description: result,
		// 	},
		// )

		return flashRedirect(
			303,
			resolveRoute('/clusters/[clusterId]', { clusterId }),
			{
				type: 'success',
				message: {
					title: `Updated cluster configuration.`,
					description: result,
				},
			},
			cookies,
		)
	},
}
