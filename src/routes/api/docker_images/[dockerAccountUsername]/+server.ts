import { e } from '$/lib/db'
import { json } from '@sveltejs/kit'

export const GET = async ({
	locals: { client },
	params: { dockerAccountUsername },
	fetch,
}) => {
	return json(
		await e.select(e.DockerAccount, () => ({
			username: true,
			password: true,
			filter_single: {
				user: e.global.current_user,
				username: dockerAccountUsername,
			},
		}))
			.run(client)
			.then(dockerAccount => (
				dockerAccount
					? (
						fetch('/api/images/user', {
							headers: {
								user: dockerAccount.username,
								pat: dockerAccount.password,
							}
						})
							.then(response => response.json())
							.catch(e => {
								console.error(`Error fetching Docker images for user "${dockerAccount.username}":`, e)
								return undefined
							})
					)
					: undefined
			))
	)
}
