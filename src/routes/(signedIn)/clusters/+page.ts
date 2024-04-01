// Types
import type { getClustersForUser } from '$/lib/db/queries';

// Data
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const clusters = (await fetch('/api/cluster').then((result) => result.json())) as Awaited<
		ReturnType<typeof getClustersForUser>
	>;

	return {
		clusters,
	};
};
