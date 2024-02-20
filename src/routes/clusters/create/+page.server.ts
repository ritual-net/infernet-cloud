// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Types
import type { QueriedServiceAccount } from '$/routes/api/service_account/+server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
	fetch,
}) => {
	const data = await parent()

	const serviceAccounts = await fetch(`/api/service_account`)
		.then<QueriedServiceAccount[]>(response => response.json())

	const formData = await superValidate(zod(FormData))

	return {
		images: data.images,
		serviceAccounts,
		formData,
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
