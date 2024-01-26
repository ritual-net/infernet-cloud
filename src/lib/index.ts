import { ProviderTypeEnum } from '$types/provider';
import { AWSTerraform } from './terraform/aws';
import { GCPTerraform } from './terraform/gcp';
import { BaseClient } from './clients/base';
import { AWSClient } from './clients/aws';
import { GCPClient } from './clients/gcp';

export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform(),
};

export const ProviderClient: Record<string, BaseClient> = {
	[ProviderTypeEnum.AWS]: new AWSClient(),
	[ProviderTypeEnum.GCP]: new GCPClient()
};
