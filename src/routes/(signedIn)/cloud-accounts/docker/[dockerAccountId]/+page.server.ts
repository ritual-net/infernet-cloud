
// Actions
import { type Actions } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'
import { e } from '$/lib/db'
import { message } from 'sveltekit-superforms/server'

export const actions: Actions = {
	delete: async ({
		locals: { client },
		cookies,
		params: { dockerAccountId },
	}) => {
		try{
			await e.delete(e.DockerAccount, () => ({
				filter_single: {
					id: e.uuid(dockerAccountId!),
				},
			}))
				.run(client)
		} catch (error) {
			return message(
				{},
				{
					title: `Couldn't disconnect Docker account.`,
					description: (error as unknown as Error).message,
				},
				{
					status: 500,
				},
			)
		}

		return flashRedirect(
			303,
			`/cloud-accounts`,
			{
				type: 'success',
				message: {
					title: `Disconnected Docker account.`,
				},
			},
			cookies,
		)
	},
}
