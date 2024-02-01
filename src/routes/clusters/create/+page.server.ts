// Schema
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	request,
	fetch,
	locals,
}) => {
	const form = await superValidate(request, FormData)
		
	const { userId } = locals.getSession()

	const serviceAccounts = await fetch(`/api/service_account?${new URLSearchParams({
		user: userId,
	})}`)
		.then(response => response.json())

	return {
		form,
		serviceAccounts,
	}
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
	}) => {
		const form = await superValidate(request, FormData)

		if (!form.valid) {
			return fail(400, { form })
		}

		const result = await fetch('/api/cluster', {
			method: 'POST',
			body: JSON.stringify(form.data),
		})
			.then(response => response.json())

		console.log({result})

		return {
			form,
			result,
		}
	},
}
