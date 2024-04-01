import { e } from '$/lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Fetch the signed in user.
 *
 * @returns the current User object.
 */
export const GET: RequestHandler = async ({ locals: { client } }) => {
	const user = await e
		.select(e.global.current_user, () => ({
			name: true,
			email: true,
		}))
		.run(client);

	return json(user);
};
