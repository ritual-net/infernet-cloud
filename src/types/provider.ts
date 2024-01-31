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
export type GCPNodeClientArgs = {
	project: string;
	zone: string;
};

export type NodeInfo = {
	id: string | undefined;
	status: string | undefined;
	ip: string | undefined;
	node: InfernetNode | undefined;
};
