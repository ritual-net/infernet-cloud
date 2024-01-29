import { createClient } from 'edgedb';
export const client = createClient();

import e, { type $infer } from '$schema/edgeql-js';
export { e, type $infer };

import { AWSQueries } from './providers/aws';
import { GCPQueries } from './providers/gcp';
import type { Queries } from './base';
import type { CloudProvider } from '$schema/interfaces';

export const QueryByProvider: { [key in CloudProvider]: Queries } = {
	AWS: AWSQueries,
	GCP: GCPQueries,
};
