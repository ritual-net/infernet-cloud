import { AWSNodeClient } from './clients/node/providers/aws';
import { AWSResourceClient } from './clients/resource/providers/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { AWSQueries } from '$/lib/db/providers/aws';
import { GCPNodeClient } from './clients/node/providers/gcp';
import { GCPResourceClient } from './clients/resource/providers/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import { GCPQueries } from '$/lib/db/providers/gcp';
import { ProviderTypeEnum } from '$/types/provider';

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
		classArgs: (cluster, service_account) => [service_account.creds, cluster.region],
		functionArgs: (_1, _2) => ({}),
	},
	[ProviderTypeEnum.GCP]: {
		class: GCPNodeClient,
		classArgs: (_, service_account) => [service_account.creds],
		functionArgs: (cluster, service_account) => ({
			project: service_account.creds.project_id,
			zone: cluster.zone,
		}),
	},
};

/**
 * DB query functions for each cloud provider. Does not have to be instantiated.
 */
export const ProviderQueries = {
	[ProviderTypeEnum.AWS]: AWSQueries,
	[ProviderTypeEnum.GCP]: GCPQueries,
};
