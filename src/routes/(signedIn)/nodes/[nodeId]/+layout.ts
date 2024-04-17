// Types
import type { InfernetNodeWithInfo } from '$/types/provider'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	parent,
	params: { nodeId },
	fetch,
}) => {
	const [
		parentData,
		nodeWithInfo,
	] = await Promise.all([
		parent(),

		(async () => {
			const response = await fetch(
				`${resolveRoute('/api/node/[nodeId]', {
					nodeId,
				})}?${new URLSearchParams({ includeClusterBacklink: 'true' })}`
			)

			if(!response.ok){
				const result = await response.json()

				return error(response.status, result.message)
			}

			return await response.json() as InfernetNodeWithInfo
		})()
	])

	return {
		...parentData,
		...nodeWithInfo,
	}
}
