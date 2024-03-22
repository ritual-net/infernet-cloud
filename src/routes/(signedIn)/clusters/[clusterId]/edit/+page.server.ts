// Schema
import { message, superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Actions
import { type Actions, fail, redirect } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		params: { clusterId },
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

		return message(
			formData,
			{
				title: `Updated cluster configuration.`,
				description: result,
			},
		)

		// return redirect(301, resolveRoute('/clusters/[clusterId]', { clusterId }))
	},
}
