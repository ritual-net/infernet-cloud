// Schema
import { message, superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
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

	const formData = await superValidate(yup(FormData))

	return {
		images: data.images,
		serviceAccounts,
		formData,
	}
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
		cookies,
	}) => {
		const formData = await superValidate(request, yup(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		for(const node of formData.data.nodes){
			delete node.id
		}

		const response = await fetch('/api/cluster', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't create cluster.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.json()

		// return message(
		// 	formData,
		// 	{
		// 		title: `Created cluster "${formData.data.config.name}"${formData.data.nodes.length ? ` with ${formData.data.nodes.length} node${formData.data.nodes.length === 1 ? '' : 's'}.` : ''}`,
		// 		description: result.message,
		// 	},
		// )

		return flashRedirect(
			303,
			resolveRoute('/clusters/[clusterId]', { clusterId: result.clusterId }),
			{
				type: 'success',
				message: {
					title: `Created cluster "${formData.data.config.name}"${formData.data.nodes.length ? ` with ${formData.data.nodes.length} node${formData.data.nodes.length === 1 ? '' : 's'}.` : ''}`,
					description: result.message,
				},
			},
			cookies,
		)
	},
}
