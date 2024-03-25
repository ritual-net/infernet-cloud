// Actions
import { loadFlash } from 'sveltekit-flash-message/server'


// Data
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = loadFlash(async ({
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
})
