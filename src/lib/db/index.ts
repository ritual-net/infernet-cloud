import { createClient } from 'edgedb';
export const client = createClient();

import e, { type $infer } from '$schema/edgeql-js';
export { e, type $infer };

import { AWSQueries } from './providers/aws';
import { GCPQueries } from './providers/gcp';

export const QueryByProvider = {
	AWS: AWSQueries,
	GCP: GCPQueries,
};
