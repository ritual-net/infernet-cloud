import { e } from '$/lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve a Container Template by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param params - The parameters object, expected to contain 'containerTemplateId'.
 * @returns ContainerTemplate object.
 */
export const GET: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.containerTemplateId;

	if (!id) {
		return error(400, 'Container template id is required');
	}

	const result = await e
		.select(e.ContainerTemplate, () => ({
			...e.ContainerTemplate['*'],
			filter_single: { id },
		}))
		.run(client);
	return json(result);
};

/**
 * Delete a Container Template by its ID.
 *
 * @param locals - The locals object contains the client.
 * @param request - The parameters object, expected to contain 'containerTemplateId'.
 * @returns ID of the deleted container template.
 */
export const DELETE: RequestHandler = async ({ locals: { client }, params }) => {
	const id = params.containerTemplateId;

	if (!id) {
		return error(400, 'Container template id is required');
	}

	// Delete container template
	const result = await e
		.delete(e.ContainerTemplate, () => ({
			filter_single: { id },
		}))
		.run(client);

	return json(result);
};
