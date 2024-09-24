import { e } from '$/lib/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

/**
 * Retrieve a Container by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'containerId'.
 * @returns Container object.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	params,
}) => {
	const id = params.containerId

	if (!id)
		return error(400, 'Container id is required')

	const result = await e
		.select(e.Container, () => ({
			...e.Container['*'],
			filter_single: { id },
		}))
		.run(client)

	return json(result)
}
