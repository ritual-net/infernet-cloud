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

export enum GCPInstanceStatus {
	PROVISIONING = 'PROVISIONING',
	STAGING = 'STAGING',
	RUNNING = 'RUNNING',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
	SUSPENDING = 'SUSPENDING',
	SUSPENDED = 'SUSPENDED',
	TERMINATED = 'TERMINATED',
}

export enum AWSInstanceStatus {
	PENDING = 'pending',
	RUNNING = 'running',
	SHUTTING_DOWN = 'shutting-down',
	TERMINATED = 'terminated',
	STOPPING = 'stopping',
	STOPPED = 'stopped',
}

export type NodeInfo = {
	id: string;
	status: AWSInstanceStatus | GCPInstanceStatus;
	ip: string | null | undefined;
	node: InfernetNode | null | undefined;
};
