// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	request,
	fetch,
}) => {
	const formData = await superValidate(request, zod(FormData))

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
		const formData = await superValidate(request, zod(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const response = await fetch('/api/cluster', {
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
