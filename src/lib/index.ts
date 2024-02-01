import { AWSNodeClient } from './clients/node/providers/aws';
import { AWSResourceClient } from './clients/resource/providers/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPNodeClient } from './clients/node/providers/gcp';
import { GCPResourceClient } from './clients/resource/providers/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import {
	ProviderTypeEnum,
	type ProviderCluster,
	type ProviderServiceAccount,
} from '$/types/provider';
import type { GCPCluster, GCPServiceAccount } from '$schema/interfaces';

/**
 * The Terraform provider for each cloud provider. Since these classes are stateless,
 * they can be instantiated once and reused.
 */
export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform(),
};

/**
 * The console client for each cloud provider. Since these classes are stateful, they
 * must be instantiated for each request.
 */
export const ProviderClient = {
	[ProviderTypeEnum.AWS]: AWSResourceClient,
	[ProviderTypeEnum.GCP]: GCPResourceClient,
};

/**
 * The node client for each cloud provider. Since these classes are stateful, they
 * must be instantiated for each request.
 */
export const NodeClient = {
	[ProviderTypeEnum.AWS]: {
		class: AWSNodeClient,
		classArgs: (cluster: ProviderCluster, service_account: ProviderServiceAccount) => [
			service_account.creds,
			cluster.region,
		],
		functionArgs: (_1: ProviderCluster, _2: ProviderServiceAccount) => ({}),
	},
	[ProviderTypeEnum.GCP]: {
		class: GCPNodeClient,
		classArgs: (_: ProviderCluster, service_account: ProviderServiceAccount) => [
			service_account.creds,
		],
		functionArgs: (cluster: ProviderCluster, service_account: ProviderServiceAccount) => ({
			project: (service_account as GCPServiceAccount).creds.project_id,
			zone: (cluster as GCPCluster).zone,
		}),
	},
};
