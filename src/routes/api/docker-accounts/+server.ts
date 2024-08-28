import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { e } from '$/lib/db'

export const GET: RequestHandler = async ({
	locals: { client },
}) => {
	const dockerAccounts = (
		await e.select(e.DockerAccount, () => ({
			username: true,
		}))
			.run(client)
	)

	return json(dockerAccounts)
};