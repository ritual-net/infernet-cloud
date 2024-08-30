import type { Client } from 'edgedb'
import type { AWSServiceAccount, GCPServiceAccount } from '$schema/interfaces'
import { getNodesByIds, getClusterByNodeIds, getClusterByRouterId } from '$/lib/db/queries'
import { ProviderTypeEnum } from '$/types/provider'
import { GCPNodeClient } from './providers/gcp'
import { AWSNodeClient } from './providers/aws'

export const getNodeClient = async (
	databaseClient: Client,
	nodeConfigId: string,
) => {
	const [node] = await getNodesByIds(
		databaseClient,
		[nodeConfigId],
	)

	if (!node)
		throw Error('Node could not be retrieved.')

	const cluster = await getClusterByNodeIds(
		databaseClient,
		[nodeConfigId],
		true
	)

	if (!cluster)
		throw Error('Cluster could not be retrieved.')

	return (
		cluster.service_account.provider === ProviderTypeEnum.GCP ?
			new GCPNodeClient(
				(cluster.service_account as GCPServiceAccount).creds,
				node.zone || cluster.zone,
				nodeConfigId,
			)
		: cluster.service_account.provider === ProviderTypeEnum.AWS ?
			new AWSNodeClient(
				(cluster.service_account as AWSServiceAccount).creds,
				node.region || cluster.region,
				nodeConfigId,
			)
		:
			undefined
	)
}

/**
 * Applies the given action to a router and returns the result.
 *
 * @param client - The database client
 * @param routerConfigId - id of the router
 * @throws Error if router could not be retrieved, or action is not supported
 */
export const restartRouter = async (
	client: Client,
	routerConfigId: string,
) => {
	const cluster = await getClusterByRouterId(client, routerConfigId, true)

	if (!cluster)
		throw Error('Cluster could not be retrieved.')

	const nodeClient = (
		cluster.service_account.provider === ProviderTypeEnum.GCP ?
			new GCPNodeClient(
				(cluster.service_account as GCPServiceAccount).creds,
				cluster.router?.zone || cluster.zone,
				routerConfigId,
			)
		: cluster.service_account.provider === ProviderTypeEnum.AWS ?
			new AWSNodeClient(
				(cluster.service_account as AWSServiceAccount).creds,
				cluster.router?.region || cluster.region,
				routerConfigId,
			)
		:
			undefined
	)

	return await nodeClient?.restart()
}
