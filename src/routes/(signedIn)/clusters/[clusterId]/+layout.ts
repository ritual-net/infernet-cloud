// Types
import type { getClusterById } from '$/lib/db/queries'
import type { InfernetNodeWithInfo } from '$/types/provider'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	params: { clusterId },
	fetch,
}) => {
	const cluster = (
		await fetch(
			resolveRoute('/api/cluster/[clusterId]', { clusterId })
		)
			.then(result => result.json())
	) as Awaited<ReturnType<typeof getClusterById>>

	if(!cluster)
		error(404, `Couldn't find a cluster with ID ${clusterId}.`)

	const nodesWithInfo = await Promise.all(
		cluster.nodes.map(async node => (
			await fetch(
				resolveRoute('/api/node/[nodeId]', {
					nodeId: node.id,
				})
			)
				.then(response => response.json())
		) as InfernetNodeWithInfo)
	)

	return {
		cluster,
		nodesWithInfo,
	}
}
