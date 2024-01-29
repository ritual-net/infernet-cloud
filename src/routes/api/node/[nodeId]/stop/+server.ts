import { client, e } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { AWSQueries } from '$lib/db/providers/aws';
import { GCPQueries } from '$lib/db/providers/gcp';
import type {
	GCPServiceAccount,
	AWSServiceAccount,
	GCPCluster,
	AWSCluster,
} from '$schema/interfaces';
import { GCPNodeClient } from '$lib/node_clients/gcp';
import { AWSNodeClient } from '$lib/node_clients/aws';
import type { GCPNodeClientArgs } from '$types/provider';

/**
 * Stop a node by its ID.
 *
 * @param params - The parameters object, expected to contain 'nodeId'.
 * @returns True if successful.
 */
export const POST: RequestHandler = async ({ params }) => {
	const id = params.nodeId;

	if (!id) {
		return error(400, 'Node id is required');
	}

	// TODO: Make sure node belongs to user through auth

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
	try {
		if (GCPCluster !== null) {
			const creds = ((await GCPQueries.getServiceAccountById(
				GCPCluster.service_account.id
			)) as GCPServiceAccount)!.creds;
			const args = {
				project: creds.project_id,
				zone: GCPCluster.zone,
			} as GCPNodeClientArgs;
			await new GCPNodeClient(creds).stopNodes([node!.provider_id!], args);
		} else if (AWSCluster !== null) {
			const creds = ((await AWSQueries.getServiceAccountById(
				AWSCluster.service_account.id
			)) as AWSServiceAccount)!.creds;
			await new AWSNodeClient(creds).stopNodes([node!.provider_id!]);
		} else {
			return error(404, 'Cluster not found for node id.');
		}
	} catch (err) {
		return error(500, `Failed to stop node: ${(err as Error).message}`);
	}
	return json({ id: id, success: true, message: 'Node stopped successfully' });
};
