// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const formData = await superValidate(zod(FormData))

	return { formData }
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
	}) => {
		const formData = await superValidate(request, zod(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const response = await fetch('/api/service_account', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		return response.ok
			? {
				formData,
				result: await response.json(),
			}
			: fail(response.status, {
				formData,
				result: await response.json(),
			})
	},
}
