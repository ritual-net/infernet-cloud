import { e } from '$/lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve all container templates for the current user.
 *
 * @param locals - The locals object contains the client.
 * @returns Array of ContainerTemplate objects.
 */
export const GET: RequestHandler = async ({ locals: { client } }) => {
	const result = await e
		.select(e.ContainerTemplate, () => ({
			...e.Container['*'],
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
	const containerData = await request.json();

	const query = e.insert(e.ContainerTemplate, {
		...containerData,
		user: e.global.current_user,
	});

	try {
		const template = await query.run(client);
		return json(template);
	} catch (e) {
		return error(400, (e as Error).message);
	}
};
