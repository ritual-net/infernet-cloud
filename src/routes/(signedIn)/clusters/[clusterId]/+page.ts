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
			.map(async ({ id: nodeId }) => {
				const nodeInfoPromise = (
					fetch(
						resolveRoute('/api/node/[nodeId]/info', {
							nodeId: nodeId,
						})
					)
						.then(response => response.json())
				)

				const node = (
					await fetch(
						resolveRoute('/api/node/[nodeId]', {
							nodeId: nodeId,
						})
					)
						.then(response => response.json())
				)

				return {
					node,
					nodeInfoPromise,
				} as InfernetNodeWithInfo
			})
	)

	return {
		cluster,
		nodesWithInfoPromise,
	}
}
