import type {
	AWSCluster,
	AWSServiceAccount,
	GCPCluster,
	GCPServiceAccount
} from '$schema/interfaces';

export enum ProviderTypeEnum {
	AWS = 'AWS',
	GCP = 'GCP'
}

export type ProviderCluster = AWSCluster | GCPCluster;
export type ProviderServiceAccount = AWSServiceAccount | GCPServiceAccount;

// Define a custom error type
export interface CommandExecutionError {
	error: Error;
	stderr: string;
}

// DockerHub types
export type DockerHubCreds = {
	username: string;
	password: string; // Personal Access Token
};

export type DockerHubHeaders = {
	repoHeaders: {
		Authorization: string;
	};
	orgHeaders: {
		Authorization: string;
	};
};

export type DockerHubRepo = {
	namespace: string;
	name: string;
};

export type DockerHubOrg = {
	orgname: string;
};

// Cloud provider client types
export type Machine = {
	id: string;
	name: string;
	description: string;
	link: string;
};

export type ProviderInfo = {
	region: string;
	zones: string[];
	machines: Machine[];
};
