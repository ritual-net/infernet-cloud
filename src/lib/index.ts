import { AWSResourceClient } from './resource_clients/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPResourceClient } from './resource_clients/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import { ProviderTypeEnum } from '$types/provider';
import { AWSNodeClient } from './node_clients/aws';
import { GCPNodeClient } from './node_clients/gcp';
import type { GCPNodeClientArgs } from '$types/provider';
import type { GCPCluster, AWSCluster } from '$schema/interfaces';

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
        args: (cluster: AWSCluster) => ({})
    },
    [ProviderTypeEnum.GCP]: {
        class: GCPNodeClient,
        args: (cluster: GCPCluster) => ({project: cluster.service_account.creds.project_id, zone: cluster.zone}) as GCPNodeClientArgs,
    }
};