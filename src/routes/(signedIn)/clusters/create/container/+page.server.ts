// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { e } from '$/lib/db'

export const load: PageServerLoad = async ({
	url,
	parent,
	locals: { client },
	fetch,
}) => {
	const dockerAccountUsername = url.searchParams.get('dockerAccountUsername')

	const [
		parentData,
		formData,
		dockerUserImages,
	] = await Promise.all([
		parent(),

		superValidate(yup(FormData)),

		dockerAccountUsername
			? (
				e.select(e.DockerAccount, () => ({
					username: true,
					password: true,
					filter_single: {
						user: e.global.current_user,
						username: dockerAccountUsername,
					},
				}))
					.run(client)
					.then(dockerAccount => (
						dockerAccount
							? (
								fetch('/api/images/user', {
									headers: {
										user: dockerAccount.username,
										pat: dockerAccount.password,
									}
								})
									.then(response => response.json())
									.catch(e => {
										console.error(`Error fetching Docker images for user "${dockerAccount.username}":`, e)
										return undefined
									})
							)
							: undefined
					))
					.then(results => (
						results.map(slug => ({
							value: slug,
							label: slug,
						}))
					))
			)
			: undefined,
	])

	return {
		...parentData,
		formData,
		dockerAccountUsername,
		dockerUserImages,
	}
}

export const actions: Actions = {
	default: async () => {
		redirect(301, '/clusters/create')
	},
}
