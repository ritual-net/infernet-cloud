import { ProviderTypeEnum } from '$lib/types';
import { AWSTerraform } from './terraform/aws';
import { GCPTerraform } from './terraform/gcp';

export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform()
};
