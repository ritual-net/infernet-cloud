// Schema
import { message, superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'
import { e } from '$/lib/db'

export const load: PageServerLoad = async ({
	parent,
	params: { clusterId },
	locals: { client },
}) => {
	const [
		parentData,
		dockerAccounts,
		formData,
	] = await Promise.all([
		parent(),

		e.select(e.DockerAccount, () => ({
			username: true,
		}))
			.run(client),
		
		superValidate({
			clusterId,
		}, yup(FormData)),
	])

	return {
		...parentData,
		dockerAccounts,
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
		params: { clusterId },
		cookies,
	}) => {
		const formData = await superValidate(request, yup(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		delete formData.data.node.id

		const response = await fetch('/api/node', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't add node to cluster.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.json()

		return flashRedirect(
			303,
			resolveRoute('/cluster/[clusterId]', { clusterId }),
			// resolveRoute('/nodes/[nodeId]', { nodeId: result.node.id }),
			{
				type: 'success',
				message: {
					title: `Added node to cluster with ${formData.data.node.containers.length} containers.`,
					description: result.message,
				},
			},
			cookies,
		)
	},
}
