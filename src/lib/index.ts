import { AWSClient } from './clients/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPClient } from './clients/gcp';
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
	[ProviderTypeEnum.AWS]: AWSClient,
	[ProviderTypeEnum.GCP]: GCPClient,
};
