// Types
import type { InfernetNodeWithInfo } from '$/types/provider'


// Data
import type { PageLoad } from './$types'

import { resolveRoute } from '$app/paths'

export const load: PageLoad = async ({
	parent,
	fetch,
}) => {
	const { cluster } = await parent()

	const nodesWithInfoPromise = Promise.all(
		cluster.nodes
			.map(async node => (
				await fetch(
					resolveRoute('/api/node/[nodeId]', {
						nodeId: node.id,
					})
				)
					.then(response => response.json())
					.catch(error => ({
						infoError: error,
					}))
			) as InfernetNodeWithInfo)
	)

	return {
		cluster,
		nodesWithInfoPromise,
	}
}
