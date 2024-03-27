// Data
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async ({
	parent,
}) => {
	const { user } = await parent()

	if(!user)
		redirect(303, '/login')
}


// Actions
import { type Actions, redirect } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

export const actions: Actions = {
	signOut: async ({
		cookies,
	}) => {
		cookies.delete('edgedb-auth-token', { path: '/' })

		return flashRedirect(
			303,
			'/login',
			{
				type: 'success',
				message: {
					title: `Signed out.`,
				},
			},
			cookies,
		)
	},
}
