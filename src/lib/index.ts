import { AWSClient } from './clients/aws';
import { AWSTerraform } from './terraform/providers/aws';
import { BaseClient } from './clients/base';
import { GCPClient } from './clients/gcp';
import { GCPTerraform } from './terraform/providers/gcp';
import { ProviderTypeEnum } from '$types/provider';

export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform(),
};

export const ProviderClient: Record<string, BaseClient> = {
	[ProviderTypeEnum.AWS]: new AWSClient(),
	[ProviderTypeEnum.GCP]: new GCPClient(),
};
