import e, { type $infer } from '$schema/edgeql-js';
export { e, type $infer };

export const ClusterTypeByProvider = {
	AWS: e.AWSCluster,
	GCP: e.GCPCluster,	
};

export const ClusterSpreadParamsByProvider = {
	AWS: e.AWSCluster['*'],
	GCP: e.GCPCluster['*'],
}

export const ServiceAccountTypeByProvider = {
	AWS: e.AWSServiceAccount,
	GCP: e.GCPServiceAccount,
};
