import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	fetch,
}) => ({
	clusters: (
		await fetch(`/api/cluster`)
			.then(r => r.json())
	),
})
