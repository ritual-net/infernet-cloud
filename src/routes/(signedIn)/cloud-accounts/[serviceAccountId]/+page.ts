// Types
import type { getClusters } from '$/lib/db/queries'


// Data
import type { PageLoad } from './$types'

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
	} as {
		clusters: ReturnType<typeof getClusters>
	}
}
