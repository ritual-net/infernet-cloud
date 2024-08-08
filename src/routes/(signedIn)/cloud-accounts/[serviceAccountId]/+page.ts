// Types
import type { getServiceAccountById } from '$/lib/db/queries'


// Data
import type { PageLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({
	params: { serviceAccountId },
	fetch,
}) => {
	return {
		clusters: (
			fetch(`/api/cluster?${new URLSearchParams({
				serviceAccountId,
			})}`)
				.then(result => result.json())
		)
	} as Awaited<ReturnType<typeof getClusters>>
}
