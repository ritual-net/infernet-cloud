import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { getNodeClient } from '$/lib/clients/node/common'

/**
 * Get the logs of a node by its id.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns success boolean and message.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	params: { nodeId },
}) => {
	if (!nodeId)
		return error(400, 'Node id is required')

	try {
		const nodeClient = await getNodeClient(client, nodeId)

		if (!nodeClient)
			return error(500, 'Node client not found')

		return json(
			await nodeClient.getLogs()
		)
	} catch (e) {
		return error(500, (e as Error).message)
	}
}
