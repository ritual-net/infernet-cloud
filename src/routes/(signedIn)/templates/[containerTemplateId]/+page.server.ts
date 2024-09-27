// Actions
import type { Actions } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'
import { message } from 'sveltekit-superforms/server'
import { resolveRoute } from '$app/paths'

export const actions: Actions = {
	delete: async ({
		cookies,
		params: { containerTemplateId },
		fetch,
	}) => {
		try{
			await fetch(
				resolveRoute('/api/container_template/[containerTemplateId]', {
					containerTemplateId,
				}),
				{
					method: 'DELETE',
				},
			)
				.then(response => response.json())
		} catch (error) {
			return message(
				{},
				{
					title: `Couldn't delete container template.`,
					description: (error as unknown as Error).message,
				},
				{
					status: 500,
				},
			)
		}

		return flashRedirect(
			303,
			`/templates`,
			{
				type: 'success',
				message: {
					title: `Deleted container template.`,
				},
			},
			cookies,
		)
	},
}
