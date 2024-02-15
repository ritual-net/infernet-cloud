// Schema
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	request,
	fetch,
}) => {
	const formData = await superValidate(request, FormData)

	const serviceAccounts = await fetch(`/api/service_account`)
		.then(response => response.json())

	return {
		formData,
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
		const formData = await superValidate(request, FormData)

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const result = await fetch('/api/cluster', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})
			.then(response => response.json())

		console.log({result})

		return {
			formData,
			result,
		}
	},
}
