import e, { createClient as createEdgedbClient } from '$schema/edgeql-js';
export { e };

export const ClusterTypeByProvider = {
	AWS: e.AWSCluster,
	GCP: e.GCPCluster,
};

export const ClusterSpreadParamsByProvider = {
	AWS: e.AWSCluster['*'],
	GCP: e.GCPCluster['*'],
};

export const ServiceAccountTypeByProvider = {
	AWS: e.AWSServiceAccount,
	GCP: e.GCPServiceAccount,
};

/**
 * Create an Edgedb client. If the environment is production, use the
 * production settings. Otherwise, use the local project settings.
 * 
 * @returns The Edgedb client
 */
export const createClient = () => {
	if (process.env.NODE_ENV === 'production') {
		return createEdgedbClient({
			dsn: process.env.EDGEDB_DSN,
			tlsSecurity: 'insecure',
		});
	} else {
		return createEdgedbClient();
	}
}
