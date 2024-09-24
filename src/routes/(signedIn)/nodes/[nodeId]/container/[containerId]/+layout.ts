// Types
import type { Container } from '$schema/interfaces'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	params: { containerId },
	fetch,
}) => {
	const container = (
		await fetch(
			resolveRoute('/api/container/[containerId]', { containerId })
		)
			.then(result => result.json())
	) as Container

	if(!container)
		error(404, `Couldn't find a container with ID ${containerId}.`)

	return {
		container,
	}
}
