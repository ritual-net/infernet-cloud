import { client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { AWSQueries } from '$lib/db/aws';
import { GCPQueries } from '$lib/db/gcp';
import type {
	GCPServiceAccount,
	AWSServiceAccount,
	GCPCluster,
	AWSCluster,
} from '$schema/interfaces';
import { GCPNodeClient } from '$lib/node_clients/gcp';
import { AWSNodeClient } from '$lib/node_clients/aws';
import type { GCPNodeClientArgs, NodeInfo } from '$types/provider';

/**
 * Retrieve a node and its status/info by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns NodeInfo object.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

	// Get node by id
	const node = await e
		.select(e.InfernetNode, () => ({
			...e.InfernetNode['*'],
			containers: {
				...e.Container['*'],
			},
			filter_single: { id },
		}))
		.run(client);

	const GCPCluster = (await GCPQueries.getClusterByNodeId(id)) as GCPCluster;
	const AWSCluster = (await AWSQueries.getClusterByNodeId(id)) as AWSCluster;
	let nodeInfo: NodeInfo;
	if (GCPCluster !== null) {
		const creds = (GCPCluster.service_account as GCPServiceAccount).creds;
		const args = {
			project: creds.project_id,
			zone: GCPCluster.zone,
		} as GCPNodeClientArgs;
		nodeInfo = (await new GCPNodeClient(creds).getNodesInfo([node!.provider_id!], args))[0];
		nodeInfo.node = node;
	} else if (AWSCluster !== null) {
		const creds = (AWSCluster.service_account as AWSServiceAccount).creds;
		nodeInfo = (await new AWSNodeClient(creds).getNodesInfo([node!.provider_id!]))[0];
		nodeInfo.node = node;
	} else {
		return error(404, 'Cluster not found for node id.');
	}
	return json(nodeInfo);
};

// TODO: PATCH

// TODO: DELETE
