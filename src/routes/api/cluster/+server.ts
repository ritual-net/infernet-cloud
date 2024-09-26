// Types
import { TFAction } from '$/types/terraform'
import type { RequestHandler } from '@sveltejs/kit'

// Schema
import type { Cluster } from '$schema/interfaces'
import type z from 'yup'
import { setDefaultNodeValues, type FormData as CreateClusterFormData } from '$/routes/(signedIn)/clusters/create/schema'

// Functions
import { error, json } from '@sveltejs/kit'
import { e, ClusterTypeByProvider } from '$/lib/db'
import { clusterAction } from '$/lib/terraform/common'
// import { createNodeParams, nodeQueryFields } from '$/lib/db/components'
import { nodeJsonQueryFields } from '$/lib/db/components'
import { getServiceAccountById, getClusters } from '$/lib/db/queries'

/**
 * Fetch all clusters for a user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of Cluster objects.
 */
export const GET: RequestHandler = async ({
	locals: { client },
	url,
}) => {
	const serviceAccountId = url.searchParams.get('serviceAccountId')

	// Get all clusters (optionally by service account)
	const result = await getClusters(client, serviceAccountId)

	return json(result)
}

/**
 * Create a new cluster with a given service account and an array of node configs.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'serviceAccountId', 'config', 'nodes'.
 * @returns Cluster ID, success boolean, and Terraform message.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const { serviceAccountId, config, router, nodes } = await request.json() as z.InferType<typeof CreateClusterFormData>;

	if (!serviceAccountId || !config || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
		return error(400, 'Service account and at least one node are required')
	}

	// nodes.forEach(setDefaultNodeValues)

	// Get provider of service account
	const serviceAccount = await getServiceAccountById(client, serviceAccountId, true)
	if (!serviceAccount) {
		return error(400, 'Service account could not be retrieved')
	}

	let cluster: Pick<Cluster, 'id'>

	const { deploy_router, ...clusterConfig } = config

	try {
		// Insert cluster
		cluster = await e
			.params(
				{
					nodes: e.array(e.json),
				},
				({ nodes }) => e.insert(ClusterTypeByProvider[serviceAccount.provider], {
					...clusterConfig,
					service_account: e.select(e.ServiceAccount, () => ({
						filter_single: { id: serviceAccountId },
					})),
					...deploy_router && {
						router: e.tuple({
							region: router.region!,
							zone: router.zone!,
							machine_type: router.machine_type,
							machine_image: router.machine_image,
						}),
					},
					// nodes: e.for(e.array_unpack(nodes), (node) => (
					// 	e.insert(nodeQueryFields(node))
					// )),
					nodes: e.for(e.array_unpack(nodes), (node) => (
						e.insert(e.InfernetNode, nodeJsonQueryFields(node))
					)),
				})
			)
			.run(client, { nodes })
	} catch (e) {
		console.error(e)

		if ((e as unknown as Error).message?.includes(`violates exclusivity constraint`)) {
			return error(500, `A cluster with name "${config.name}" already exists.`)
		}

		return error(500, (e as Error).message)
	}

	// Apply Terraform changes to created cluster
	// (Run in background - don't block API response)
	;(async () => {
		let result: Awaited<ReturnType<typeof clusterAction>>

		try {
			result = await clusterAction(
				client,
				cluster.id,
				TFAction.Apply
			)
		} catch (e) {
			console.error(e)
		}
	})()

	return json({
		cluster,
	})
}
