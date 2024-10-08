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
	const hasGpu = url.searchParams.has('hasGpu')
	const isOnchain = url.searchParams.has('isOnchain')
	const isPaymentsEnabled = url.searchParams.has('isPaymentsEnabled')
	const chainId = url.searchParams.has('chainId') ? Number(url.searchParams.get('chainId')) : undefined
	const dockerAccountUsername = url.searchParams.get('dockerAccountUsername') ?? undefined

	const containerTemplatesPromise = fetch(`/api/container_template${dockerAccountUsername ? `?${new URLSearchParams({ dockerAccountUsername })}` : ''}`)
		.then(response => response.json())

	const [
		formData,
		dockerUserImages,
	] = await Promise.all([
		superValidate(yup(FormData)),

		dockerAccountUsername
			? (
				fetch(resolveRoute('/api/docker_images/[dockerAccountUsername]', { dockerAccountUsername }))
					.then(response => response.json())
					.then(results => (
						(results as string[]).map((slug: string) => ({
							value: slug,
							label: slug,
						}))
					))
			)
			: undefined,
	])

	return {
		formData,
		containerTemplatesPromise,
		nodeConfiguration: {
			hasGpu,
			isOnchain,
			isPaymentsEnabled,
			chainId,
			dockerAccountUsername,
		},
		dockerUserImages,
	}
}

export const actions: Actions = {
	default: async () => {
		redirect(301, '/clusters/create')
	},
}
