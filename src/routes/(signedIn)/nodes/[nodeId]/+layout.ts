// Types
import type { NodeInfo } from '$/types/provider';

// Data
import type { LayoutLoad } from './$types';

import { resolveRoute } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { InfernetNode } from '$schema/interfaces';

export const load: LayoutLoad = async ({ parent, params: { nodeId }, fetch }) => {
	const [parentData, nodeResult] = await Promise.all([
		parent(),

		(async () => {
			const response = await fetch(
				resolveRoute('/api/node/[nodeId]', {
					nodeId,
				})
			);

			if (!response.ok) {
				const result = await response.json();

				return error(response.status, result.message);
			}

			return (await response.json()) as {
				node: InfernetNode;
				info?: NodeInfo;
				infoError?: string;
			};
		})(),
	]);

	return {
		...parentData,
		...nodeResult,
	};
};
