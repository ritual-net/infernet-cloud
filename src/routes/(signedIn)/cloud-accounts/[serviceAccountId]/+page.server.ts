
// Actions
import { type Actions } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'
import { message } from 'sveltekit-superforms/server'

export const actions: Actions = {
	delete: async ({
		cookies,
		params: { serviceAccountId },
		fetch,
	}) => {
		try{
			const result = await fetch(`/api/service_account/${serviceAccountId}`, {
				method: 'DELETE',
			})
				.then(async response => {
					if (!response.ok) {
						const error = await response.json()
						throw new Error(error.message)
					}
					return response.json()
				})
		}catch(error){
			return message(
				{},
				{
					title: `Couldn't disconnect cloud account.`,
					description: (error as Error).message,
				},
				{
					status: 500,
				}
			)
		}

		return flashRedirect(
			303,
			`/cloud-accounts`,
			{
				type: 'success',
				message: {
					title: `Disconnected service account.`,
				},
			},
			cookies,
		)
	},
}
