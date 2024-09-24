// Types
import type { InfernetNodeWithInfo } from '$/types/provider'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	params: { nodeId },
	fetch,
}) => {
	const nodeInfoPromise = (
		fetch(
			resolveRoute('/api/node/[nodeId]/info', {
				nodeId,
			})
		)
			.then(response => response.json())
	)

	const response = await fetch(
		`${resolveRoute('/api/node/[nodeId]', {
			nodeId,
		})}?${new URLSearchParams({
			includeClusterBacklink: 'true',
			includeClusterTfstate: 'true',
		})}`
	)

	if(!response.ok){
		const result = await response.json()

		return error(response.status, result.message)
	}

	try {
		const node = await response.json()

		return {
			node,
			nodeInfoPromise,
		} as InfernetNodeWithInfo
	}catch(e){
		return error(500, e)
	}
}
