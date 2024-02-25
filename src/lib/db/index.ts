import e, { createClient as createEdgedbClient } from '$schema/edgeql-js';
import { env } from '$env/dynamic/private';

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
	if (env.NODE_ENV === 'production') {
		return createEdgedbClient({
			dsn: env.EDGEDB_DSN,
			/**
			 * The `tlsSecurity` option is set to 'insecure' because the
			 * production Edgedb server uses a self-signed certificate. This is
			 * acceptable because the db server is only accessible from the
			 * internal network, and not exposed to the public internet.
			 */
			tlsSecurity: 'insecure',
		});
	} else {
		return createEdgedbClient();
	}
};
