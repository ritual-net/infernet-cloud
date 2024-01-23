import { client, e } from '$db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Retrieve all service accounts for a user.
 * 
 * @returns Array of ServiceAccount objects.
 */
export const GET: RequestHandler = async ({ url }) => {
	const user = url.searchParams.get('user');

	if (!user) {
		return error(400, 'id is required');
	}

	// TODO: Get user through auth, not through query params

	// Get service accounts for user
	const result = await e
		.select(e.ServiceAccount, (sa) => ({
			id: true,
			credentials: true,
			provider: true,
			filter: e.op(sa.user.id, '=', e.uuid(user))
		}))
		.run(client);

	return json(result);
};

/**
 * Create a new service account.
 * 
 * @param request - The request object containing 'provider' and 'credentials'.
 * @returns Newly created ServiceAccount object.
 */
export const POST: RequestHandler = async ({ request }) => {
	// TODO: get user through auth, not through body
	const { user, provider, credentials } = await request.json();

	if (!user || !provider || !credentials) {
		return error(400, 'user, provider, and credentials are required');
	}

	// Create service account
	const result = await e
		.insert(e.ServiceAccount, {
			user: e.select(e.User, () => ({
				filter_single: { id: user }
			})),
			provider,
			credentials
		})
		.run(client);

	return json(result);
};

/**
 * Delete a service account by its ID.
 * 
 * @param request - The request object containing 'id'.
 * @returns ID of the deleted service account.
 */
export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	if (!id) {
		return error(400, 'id is required');
	}

	// TODO: confirm sa belongs to user through auth, before deleting

	// Delete service account
	const result = await e
		.delete(e.ServiceAccount, (sa) => ({
			filter_single: e.op(sa.id, '=', e.uuid(id))
		}))
		.run(client);

	return json(result);
};
