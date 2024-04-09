import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { DockerHubClient } from '$/lib/docker/docker';

export const GET: RequestHandler = async ({
	url,
}) => {
	const query = url.searchParams.get('query')

	if(!query)
		return error(400, 'No query specified.')

	return json(await new DockerHubClient().searchImages(query));
};
