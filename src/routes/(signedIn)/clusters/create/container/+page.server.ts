// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'

export const load: PageServerLoad = async ({
	url,
	fetch,
}) => {
	const dockerAccountUsername = url.searchParams.get('dockerAccountUsername')
	const isOnchain = url.searchParams.has('isOnchain')

	const containerTemplatesPromise = fetch(`/api/container_template${dockerAccountUsername ? `?${new URLSearchParams({ dockerAccountUsername })}` : ''}`)
		.then(response => response.json())

	const [
		formData,
		dockerUserImages,
	] = await Promise.all([
		superValidate(yup(FormData)),

		dockerAccountUsername && (
			fetch(resolveRoute('/api/docker_images/[dockerAccountUsername]', { dockerAccountUsername }))
				.then(response => response.json())
				.then(results => (
					results.map(slug => ({
						value: slug,
						label: slug,
					}))
				))
		),
	])

	return {
		formData,
		containerTemplatesPromise,
		dockerAccountUsername,
		dockerUserImages,
		isOnchain,
	}
}

export const actions: Actions = {
	default: async () => {
		redirect(301, '/clusters/create')
	},
}
