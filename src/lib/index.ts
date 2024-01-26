import { ProviderTypeEnum } from '$lib/types';
import { AWSTerraform } from './terraform/aws';
import { GCPTerraform } from './terraform/gcp';
import { BaseResourceClient } from './resource_clients/base';
import { AWSResourceClient } from './resource_clients/aws';
import { GCPResourceClient } from './resource_clients/gcp';

export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform()
};

export const ProviderClient: Record<string, BaseResourceClient> = {
	[ProviderTypeEnum.AWS]: new AWSResourceClient(),
	[ProviderTypeEnum.GCP]: new GCPResourceClient()
};
