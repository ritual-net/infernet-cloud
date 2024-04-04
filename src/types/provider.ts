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
	region: {
		id: string;
		name?: string;
	},
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

export type InfernetNodeWithInfo = {
	node: InfernetNode;
	info?: NodeInfo;
	infoError?: string | undefined;
}

export enum NodeAction {
	start = 'start',
	stop = 'stop',
	info = 'info',
	restart = 'restart',
}


import AWSIcon from '$/assets/aws.svg'
import GCPIcon from '$/assets/gcp.svg'

export const providers = {
	[ProviderTypeEnum.AWS]: {
		name: 'Amazon Web Services',
		icon: AWSIcon,
	},
	[ProviderTypeEnum.GCP]: {
		name: 'Google Cloud Platform',
		icon: GCPIcon,
	},
} as const
