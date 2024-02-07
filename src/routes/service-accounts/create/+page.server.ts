// Schema
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const formData = await superValidate(FormData)

	return { formData }
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		locals,
	}) => {
		const formData = await superValidate(request, FormData)

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const { userId } = locals.getSession()

		const result = await fetch('/api/service_account', {
			method: 'POST',
			body: JSON.stringify({
				user: userId,
				...formData.data,
			}),
		})
			.then(response => response.json())

		return {
			formData,
			result,
		}
	},
}
