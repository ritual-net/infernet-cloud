// Types
import type { getClustersForUser } from '$/lib/db/queries'


// Datz
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	fetch,
}) => {
	const clusters = (
		await fetch('/api/cluster')
			.then(result => result.json())
	) as Awaited<ReturnType<typeof getClustersForUser>>

	return {
		clusters,
	}
}
