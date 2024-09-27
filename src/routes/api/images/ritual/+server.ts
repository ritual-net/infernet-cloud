import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'
import { DockerHubClient } from '$/lib/docker/docker'

/**
 * Fetch all public ritualnetwork images.
 *
 * @returns Flat array of image ids (including tag).
 */
export const GET: RequestHandler = async () => {
	return json(await new DockerHubClient().getRitualImages())
}
