// Data
import { EDGEDB_AUTH_COOKIES } from '$/lib/auth'
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
		cookies.delete(
			EDGEDB_AUTH_COOKIES.AUTH_TOKEN,
			{
				path: '/',
			}
		)

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
