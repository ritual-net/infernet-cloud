import { ProviderTypeEnum } from '$/types/provider'
import { AWSResourceClient } from './clients/resource/providers/aws'
import { AWSTerraform } from './terraform/providers/aws'
import { GCPResourceClient } from './clients/resource/providers/gcp'
import { GCPTerraform } from './terraform/providers/gcp'

/**
 * The Terraform provider for each cloud provider. Since these classes are stateless,
 * they can be instantiated once and reused.
 */
export const ProviderTerraform = {
	[ProviderTypeEnum.AWS]: new AWSTerraform(),
	[ProviderTypeEnum.GCP]: new GCPTerraform(),
} as const

/**
 * The console client for each cloud provider. Since these classes are stateful, they
 * must be instantiated for each request.
 */
export const ProviderClient = {
	[ProviderTypeEnum.AWS]: AWSResourceClient,
	[ProviderTypeEnum.GCP]: GCPResourceClient,
} as const
