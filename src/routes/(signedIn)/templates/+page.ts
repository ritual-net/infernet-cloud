// Types
import type { ContainerTemplate } from '$schema/interfaces'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	fetch,
}) => {
	const containerTemplatesPromise = (
		fetch('/api/container_template')
			.then(result => result.json())
	) as Promise<ContainerTemplate[]>

	return {
		containerTemplatesPromise,
	}
}
