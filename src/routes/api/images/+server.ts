import { error, json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import { DockerHubClient } from '$lib/docker/docker';
import type { DockerHubCreds } from '$types/docker';

/**
 * Fetch all images (public or private) owned by user, an organization the user is in,
 * or ritualnetwork.
 *
 * @param request object containing DockerHub `user` (username) and `pat` (Personal
 * Access Token) headers
 * @returns Flat array of image ids (including tag).
 */
export const GET: RequestHandler = async ({ request }: RequestEvent) => {
	const user = request.headers.get('user');
	const pat = request.headers.get('pat');
	if (!user || !pat) {
		return error(400, 'Missing user or pat in headers.');
	}

	return json(
		await new DockerHubClient().getAllTaggedRepos({
			username: user,
			password: pat
		} as DockerHubCreds)
	);
};
