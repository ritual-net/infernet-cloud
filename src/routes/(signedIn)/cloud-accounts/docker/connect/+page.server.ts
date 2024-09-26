// Types/constants
import { providers } from '$/types/provider'


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
import { type Actions, fail } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'
import { e } from '$/lib/db'

export const actions: Actions = {
	default: async ({
		request,
		locals: { client },
		cookies,
	}) => {
		const formData = await superValidate(request, yup(FormData))

		if (!formData.valid) {
			return fail(400, { formData })
		}

		try {
			await e.insert(e.DockerAccount, {
				username: formData.data.username,
				password: formData.data.password,
				user: e.global.current_user,
			})
				.run(client)
		} catch (error) {
			return message(
				formData,
				{
					title: `Couldn't connect Docker account.`,
					description: error.message,
				},
				{
					status: 400,
				},
			)
		}

		return flashRedirect(
			303,
			'/cloud-accounts',
			{
				type: 'success',
				message: {
					title: `Connected Docker account.`,
					description: `Infernet nodes may now run Docker images accessible to Docker Hub user "${formData.data.username}."`,
				},
			},
			cookies,
		)
	},
}
