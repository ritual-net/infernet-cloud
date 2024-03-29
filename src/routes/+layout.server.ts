import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	locals: { client },
	fetch,
}) => {
	const user = client
		? await fetch('/api/user')
			.then(response => response.json())
		: undefined

	return {
		user,
	}
}
