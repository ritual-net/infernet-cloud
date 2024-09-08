// Queries
import { getServiceAccountById } from '$/lib/db/queries'


// Functions
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

import { ProviderClient } from '$/lib/index'

/**
 * Fetch available cloud provider zones for a given service account and region.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	params: { serviceAccountId, regionId, zoneId },
}) => {
	if (!serviceAccountId)
		return error(400, `Service account ID is required.`)

	if (!regionId)
		return error(400, `Region ID is required.`)

	if (!zoneId)
		return error(400, `Zone ID is required.`)

	const serviceAccount = await getServiceAccountById(
		client,
		serviceAccountId,
		true
	)

	if (!serviceAccount)
		return error(400, `Service account with ID "${serviceAccountId}" does not exist.`)

	const providerClient = await new ProviderClient[serviceAccount.provider]()

	await providerClient.auth(serviceAccount.creds)

	return json(
		await providerClient.getMachines(zoneId)
	)
}
