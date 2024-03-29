// Actions
import { loadFlash, setFlash } from 'sveltekit-flash-message/server'


// Data
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = loadFlash(async ({
	locals: { client },
	fetch,
	cookies,
}) => {
	const response = await fetch('/api/user')

	if(!response.ok){
		const result = await response.json()

		setFlash(
			{
				type: 'error',
				message: {
					title: `Authentication error`,
					description: result.message,
				}
			},
			cookies,
		)

		return {
			user: undefined,
		}
	}

	const user = await response.json()

	return {
		user,
	}
})
