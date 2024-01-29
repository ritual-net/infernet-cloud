import { ProviderTypeEnum } from '$types/provider';
import { AWSTerraform } from './terraform/providers/aws';
import { GCPTerraform } from './terraform/providers/gcp';
import { BaseClient } from './clients/base';
import { AWSClient } from './clients/aws';
import { GCPClient } from './clients/gcp';

export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform(),
};

export const ProviderClient: Record<string, BaseClient> = {
	[ProviderTypeEnum.AWS]: AWSClient,
	[ProviderTypeEnum.GCP]: GCPClient,
};
