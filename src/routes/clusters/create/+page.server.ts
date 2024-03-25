// Schema
import { superValidate } from 'sveltekit-superforms/server'
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
import { type Actions, fail, redirect } from '@sveltejs/kit'
import { invalidate } from '$app/navigation'
import { resolveRoute } from '$app/paths'

export const actions: Actions = {
	default: async ({
		request,
		fetch,
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

		if(!response.ok)
			return fail(response.status, {
				formData,
				result: await response.json(),
			})

		const result = await response.json()

		return message(
			formData,
			{
				title: `Created cluster "${formData.data.config.name}"${formData.data.nodes.length ? `with ${formData.data.nodes.length} node${formData.data.nodes.length === 1 ? '' : 's'}.` : ''}`,
				description: result.message,
			},
		)

		// return redirect(301, resolveRoute('/clusters/[clusterId]', { clusterId: result.clusterId }))
	},
}
