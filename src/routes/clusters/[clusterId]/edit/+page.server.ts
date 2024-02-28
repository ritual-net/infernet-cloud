// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
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
		const formData = await superValidate(request, zod(FormData))

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

		if(!response.ok)
			return fail(response.status, {
				formData,
				result: await response.json(),
			})

		const result = await response.json()

		if(!result.success)
			return fail(500, {
				formData,
				result,
			})

		return redirect(301, resolveRoute('/clusters/[clusterId]', { clusterId }))
	},
}
