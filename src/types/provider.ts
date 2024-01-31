import type {
	AWSCluster,
	AWSServiceAccount,
	GCPCluster,
	GCPServiceAccount,
	InfernetNode,
} from '$schema/interfaces';

export enum ProviderTypeEnum {
	AWS = 'AWS',
	GCP = 'GCP',
}

export type ProviderCluster = AWSCluster | GCPCluster;
export type ProviderServiceAccount = AWSServiceAccount | GCPServiceAccount;
export type ProviderServiceAccountCreds = AWSServiceAccount['creds'] & GCPServiceAccount['creds'];

// Cloud provider client types
export type Machine = {
	id: string;
	name: string;
	description: string;
	link: string;
};

export type ProviderInfo = {
	region: string;
	zones: ZoneInfo[];
};

export type ZoneInfo = {
	name: string;
	machines: Machine[]; // all machines available in region not zone
};

// Node client types
export type NodeInfo = {
	id: string;
	status?: string;
	ip?: string;
	node?: InfernetNode;
};

export enum NodeAction {
    start = 'start',
    stop = 'stop',
    info = 'info'
}