import { e } from '$/lib/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	locals: { client },
}) => {
	const dockerAccountsPromise = (
		e.select(e.DockerAccount, () => ({
			id: true,
			username: true,
			user: {
				name: true,
				email: true,
			},
		}))
			.run(client)
	)
	
	return {
		dockerAccountsPromise,
	}
}
