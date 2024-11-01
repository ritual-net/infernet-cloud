import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	request,
	fetch,
}) => {
	const imagesPromise = fetch(`/api/images/ritual`)
		.then(response => response.json() as Promise<string[]>)
		.catch(e => {
			return []
		})

	return {
		imagesPromise,
	}
}
