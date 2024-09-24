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
	const nodeWithInfo = await (async () => {
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

		return await response.json() as InfernetNodeWithInfo
	})()

	return {
		nodeWithInfo,
	}
}
