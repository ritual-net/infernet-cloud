// Schema
import { superValidate, message } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const formData = await superValidate(yup(FormData))

	return { formData }
}


// Actions
import { type Actions, fail, redirect } from '@sveltejs/kit'
import { providers } from '$/types/provider'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
	}) => {
		const formData = await superValidate(request, yup(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		const response = await fetch('/api/service_account', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't connect service account.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		return message(
			formData,
			{
				title: `Connected service account.`,
				description: `"${formData.data.name}" is set up to deploy clusters on ${providers[formData.data.provider].name}.`,
			},
		)
		// return redirect (301, '/service-accounts')
	},
}
