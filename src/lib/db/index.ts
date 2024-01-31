import { createClient } from 'edgedb';
export const client = createClient();

import e, { type $infer } from '$schema/edgeql-js';
export { e, type $infer };

export const ClusterTypeByProvider = {
	AWS: e.AWSCluster,
	GCP: e.GCPCluster,
};
