import type {
	AWSCluster,
	AWSServiceAccount,
	GCPCluster,
	GCPServiceAccount,
	InfernetNode,
} from '$schema/interfaces';
import type { InstanceTypeInfo, Region as AwsRegion } from '@aws-sdk/client-ec2'
import type { compute_v1 } from 'googleapis'

export enum ProviderTypeEnum {
	AWS = 'AWS',
	GCP = 'GCP',
}

export type ProviderCluster = AWSCluster | GCPCluster;
export type ProviderServiceAccount = AWSServiceAccount | GCPServiceAccount;
export type ProviderServiceAccountCreds = AWSServiceAccount['creds'] & GCPServiceAccount['creds'];

// Cloud provider client types
export type Region<ProviderType extends ProviderTypeEnum = ProviderTypeEnum> = {
	id: string;
	name: string;
	continent?: string;
	info: (
		ProviderType extends ProviderTypeEnum.AWS ?
			AwsRegion
		: ProviderType extends ProviderTypeEnum.GCP ?
			compute_v1.Schema$MachineType
		:
			never
	);
}

export type Zone<ProviderType extends ProviderTypeEnum = ProviderTypeEnum> = {
	id: string;
	name: string;
	info: (
		ProviderType extends ProviderTypeEnum.AWS ?
			InstanceTypeInfo
		: ProviderType extends ProviderTypeEnum.GCP ?
			compute_v1.Schema$Zone
		:
			never
	);
}

export type Machine<ProviderType extends ProviderTypeEnum = ProviderTypeEnum> = {
	id: string;
	name: string;
	description?: string;
	hasGpu: boolean;
	info: (
		ProviderType extends ProviderTypeEnum.AWS ?
			InstanceTypeInfo
		: ProviderType extends ProviderTypeEnum.GCP ?
			compute_v1.Schema$MachineType
		:
			never
	);
}

export type ProviderInfo = {
	region: {
		id: string;
		name?: string;
	},
	zones: ZoneInfo[];
};

export type ZoneInfo = {
	name: string;
	machines: Machine[];
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
