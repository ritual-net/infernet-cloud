import type { Load } from '@sveltejs/kit'
import { resolveRoute } from '$app/paths'

export const load: Load = async ({
	fetch,
}) => ({
	clusters: (
		await fetch(resolveRoute(`/api/cluster`, {}))
			.then(r => r.json())
	),
})
