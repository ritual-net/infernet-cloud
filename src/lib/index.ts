import { AWSResourceClient } from './clients/resource/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPResourceClient } from './clients/resource/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import { ProviderTypeEnum } from '$types/provider';
import { AWSNodeClient } from './clients/node/aws';
import { GCPNodeClient } from './clients/node/gcp';
import type { GCPNodeClientArgs } from '$types/provider';
import type {
	GCPCluster,
	AWSCluster,
	GCPServiceAccount,
	AWSServiceAccount,
} from '$schema/interfaces';
import { GCPQueries } from '$lib/db/providers/gcp';
import { AWSQueries } from '$lib/db/providers/aws';

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
		args: (_1: AWSCluster, _2: AWSServiceAccount) => ({}),
	},
	[ProviderTypeEnum.GCP]: {
		class: GCPNodeClient,
		args: (cluster: GCPCluster, service_account: GCPServiceAccount) =>
			({
				project: service_account.creds.project_id,
				zone: cluster.zone,
			}) as GCPNodeClientArgs,
	},
};

/**
 * DB query functions for each cloud provider. Does not have to be instantiated.
 */
export const ProviderQueries = {
	[ProviderTypeEnum.AWS]: AWSQueries,
	[ProviderTypeEnum.GCP]: GCPQueries,
};
