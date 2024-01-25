import { createClient } from 'edgedb';
export const client = createClient();

import e, { type $infer } from '$schema/edgeql-js';
export { e, type $infer };

import { ProviderTypeEnum } from '$types/provider';
import { AWSQueries } from './aws';
import { GCPQueries } from './gcp';
export const QueryByProvider = {
	[ProviderTypeEnum.AWS]: AWSQueries,
	[ProviderTypeEnum.GCP]: GCPQueries,
};
