// Types
import type { ContainerTemplate } from '$schema/interfaces'


// Data
import type { LayoutLoad } from './$types'

import { resolveRoute } from '$app/paths'
import { error } from '@sveltejs/kit'

export const load: LayoutLoad = async ({
	params: { containerTemplateId },
	fetch,
}) => {
	const containerTemplate = (
		await fetch(
			resolveRoute('/api/container_template/[containerTemplateId]', { containerTemplateId })
		)
			.then(result => result.json())
	) as ContainerTemplate

	if(!containerTemplate)
		error(404, `Couldn't find a container template with ID ${containerTemplateId}.`)

	return {
		containerTemplate,
	}
}
