// Schema
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const form = await superValidate(FormData)

	return { form }
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		locals,
	}) => {
		const form = await superValidate(request, FormData)

		if (!form.valid) {
			return fail(400, { form })
		}

		const { userId } = locals.getSession()

		const result = await fetch('/api/service_account', {
			method: 'POST',
			body: JSON.stringify({
				user: userId,
				...form.data,
			}),
		})
			.then(response => response.json())

		return {
			form,
			result,
		}
	},
}
