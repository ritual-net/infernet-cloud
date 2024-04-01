// Types
import type { getServiceAccountById } from '$/lib/db/queries';

// Data
import type { LayoutLoad } from './$types';

import { resolveRoute } from '$app/paths';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params: { serviceAccountId }, fetch }) => {
	const serviceAccountResponse = await fetch(
		resolveRoute('/api/service_account/[serviceAccountId]', {
			serviceAccountId,
		})
	);

	if (!serviceAccountResponse.ok) {
		const result = await serviceAccountResponse.json();

		return error(serviceAccountResponse.status, result.message);
	}

	const serviceAccount = (await serviceAccountResponse.json()) as Awaited<
		ReturnType<typeof getServiceAccountById>
	>;

	if (!serviceAccount)
		return error(404, new Error(`Service account ${serviceAccountId} not found`));

	return {
		serviceAccount,
	};
};
