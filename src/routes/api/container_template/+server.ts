import { e } from '$/lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import * as z from 'yup';
import type { FormData } from '$/routes/(signedIn)/templates/create/schema'

/**
 * Retrieve all container templates for the current user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of ContainerTemplate objects.
 */
export const GET: RequestHandler = async ({ locals: { client } }) => {
	const result = await e
		.select(e.ContainerTemplate, () => ({
			...e.ContainerTemplate['*'],
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new container template.
 *
 * @param locals - The locals object contains the client.
 * @param request - The request object containing 'container'.
 * @returns Newly created ContainerTemplate object.
 */
export const POST: RequestHandler = async ({ locals: { client }, request }) => {
	const {
		containerTemplate,
	} = await request.json() as z.InferType<typeof FormData>;

	try {
		const template = await e
			.insert(e.ContainerTemplate, {
				...containerTemplate,
				user: e.global.current_user,
			})
			.run(client);
		return json(template);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
