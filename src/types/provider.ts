import type {
	AWSCluster,
	AWSServiceAccount,
	GCPCluster,
	GCPServiceAccount,
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
}
