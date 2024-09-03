// Queries
import { getServiceAccountById } from '$/lib/db/queries'

// Functions
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

import { ProviderClient } from '$/lib/index'

/**
 * Fetch machine image information for a given service account, region, zone, machine, and machine image.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	params: { serviceAccountId, machineImageId },
}) => {
	if (!serviceAccountId)
		return error(400, `Service account ID is required.`)

	if (!machineImageId)
		return error(400, `Machine image ID is required.`)

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
		await providerClient.getMachineImageInfo(machineImageId)
	)
}
