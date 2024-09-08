import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import { getServiceAccountById } from '$/lib/db/queries'
import { ProviderClient } from '$/lib/index'

export const GET: RequestHandler = async ({
	locals: { client },
	params: { serviceAccountId, regionId, zoneId, machineId },
}) => {
	if (!serviceAccountId)
		return error(400, `Service account ID is required.`)

	if (!regionId)
		return error(400, `Region ID is required.`)

	if (!zoneId)
		return error(400, `Zone ID is required.`)

	if (!machineId)
		return error(400, `Machine ID is required.`)

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
		await providerClient.getMachineImages(machineId, zoneId)
	)
}
