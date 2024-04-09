import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { DockerHubClient } from '$/lib/docker/docker';

export const GET: RequestHandler = async ({
	params: { query },
}) => {
	return json(await new DockerHubClient().searchImages(query!));
};
