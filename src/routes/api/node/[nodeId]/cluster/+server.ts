import { getClusterByNodeIds } from '$/lib/db/queries'
import { type RequestHandler, error, json } from '@sveltejs/kit'


/**
 * Retreive cluster and service account details by node ID.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	params,
}) => {
	const id = params.nodeId

	if (!id)
		return error(400, 'Node id is required')

	const cluster = await getClusterByNodeIds(client, [id])

	return json(
		cluster
	)
}
