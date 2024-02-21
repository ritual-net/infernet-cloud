import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
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
