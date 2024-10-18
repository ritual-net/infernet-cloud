// Data
import { EDGEDB_AUTH_COOKIES } from '$/lib/auth'


// Actions
import { type Actions } from '@sveltejs/kit'
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
