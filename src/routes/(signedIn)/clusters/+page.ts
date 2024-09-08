// Types
import type { getClusters } from '$/lib/db/queries'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	fetch,
}) => {
	const clustersPromise = (
		fetch('/api/cluster')
			.then(result => result.json())
	) as ReturnType<typeof getClusters>

	return {
		clustersPromise,
	}
}
