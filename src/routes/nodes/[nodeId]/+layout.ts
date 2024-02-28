// Types
import type { NodeInfo } from '$types/provider'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	params: { nodeId },
	fetch,
}) => {
	const response = await fetch(
		resolveRoute('/api/node/[nodeId]', {
			nodeId,
		})
	)

	if(!response.ok){
		const result = await response.json()

		return error(response.status, result.message)
	}

	const node = await response.json() as NodeInfo

	return {
		node,
	}
}
