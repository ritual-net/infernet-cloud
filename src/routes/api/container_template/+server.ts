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
			id: true,
			name: true,
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
	const { container } = await request.json();

	if (!container) {
		return error(400, 'Container template data are required');
	}

	const template = await e
		.params(
			{
				data: e.tuple({
					name: e.str,
					image: e.str,
					container_id: e.str,
					description: e.str,
					external: e.bool,
					allowed_addresses: e.array(e.str),
					allowed_delegate_addresses: e.array(e.str),
					allowed_ips: e.array(e.str),
					command: e.str,
					env: e.json,
					gpu: e.bool,
				}),
			},
			({ data }) =>
				e.insert(e.ContainerTemplate, {
					...data,
					user: e.global.current_user,
				})
		)
		.run(client, { data: container });
	return json(template);
};
