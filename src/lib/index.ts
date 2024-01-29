import { AWSResourceClient } from './resource_clients/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPResourceClient } from './resource_clients/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import { ProviderTypeEnum } from '$types/provider';

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
