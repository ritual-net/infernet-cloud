// Schema
import { message, superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'
import { e } from '$/lib/db'

export const load: PageServerLoad = async ({
	locals: { client },
	fetch,
	url,
}) => {
	const fromContainerTemplate = url.searchParams.has('fromContainerTemplate')
		? await e.select(e.ContainerTemplate, () => ({
			...e.ContainerTemplate['*'],
			filter_single: {
				id: url.searchParams.get('fromContainerTemplate')!,
			},
		}))
			.run(client)
		: undefined
		
	const [
		dockerAccounts,
		formData,
	] = await Promise.all([
		e.select(e.DockerAccount, () => ({
			username: true,
		}))
			.run(client),

		fromContainerTemplate
			? superValidate({
				containerTemplate: fromContainerTemplate,
			}, yup(FormData))
			: superValidate(yup(FormData))
	])

	const imagesPromise = fetch(`/api/images/ritual`)
		.then(response => response.json()) as Promise<string[]>

	return {
		dockerAccounts,
		imagesPromise,
		formData,
	}
}


// Actions
import { type Actions, fail } from '@sveltejs/kit'
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

		delete formData.data.containerTemplate.id

		const response = await fetch('/api/container_template', {
			method: 'POST',
			body: JSON.stringify(formData.data),
		})

		if(!response.ok){
			const result = await response.json()

			return message(
				formData,
				{
					title: `Couldn't create container template.`,
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
			`/templates`,
			{
				type: 'success',
				message: {
					title: `Created container template "${formData.data.containerTemplate.name}".`,
				},
			},
			cookies,
		)
	},
}
