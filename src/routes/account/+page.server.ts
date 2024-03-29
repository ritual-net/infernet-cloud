// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	locals: { user },
}) => {
	if(!user)
		redirect(303, '/login')
}


// Actions
import { type Actions, redirect } from '@sveltejs/kit'

export const actions: Actions = {
	signOut: async ({
		request,
		fetch,
		cookies,
	}) => {
		cookies.delete('edgedb-auth-token', { path: '/' })

		redirect(303, '/login')
	},
}
