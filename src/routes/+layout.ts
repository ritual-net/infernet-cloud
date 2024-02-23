import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({
	locals: { isSignedIn },
	fetch,
}) => {
	const user = isSignedIn
		? await fetch('/api/user')
			.then(response => response.json())
		: undefined

	console.log({user})

	return {
		isSignedIn,
		user,
	}
}
