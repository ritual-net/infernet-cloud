import type { Handle } from '@sveltejs/kit'
import { createClient } from './lib/db'
import { EDGEDB_AUTH_COOKIES } from './lib/auth'
import { SERVER_HOST } from '$env/static/private'

/**
 * Global middleware for the server.
 *
 * Runs before any other server request handler. It attaches the database client to
 * the request event, initializing it with the 'edgedb-auth-token' cookie. If the
 * cookie is not found, the request is rejected. The cookie is not required for
 * requests to the auth server.
 *
 * @param event - The request event.
 * @param resolve - The resolve function.
 * @returns The event with the client attached,
 */
export const handle: Handle = async ({ event, resolve }) => {
	// CORS: add headers
	if (event.request.method === 'OPTIONS')
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
				'Access-Control-Allow-Origin': SERVER_HOST,
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		})

	// Allow requests to the auth server
	if (event.url.pathname.startsWith('/auth'))
		return await resolve(event)

	// Extract token from cookie
	const token = event.cookies.get(EDGEDB_AUTH_COOKIES.AUTH_TOKEN)

	// Attach client to the event
	event.locals.client = createClient().withGlobals({
		'ext::auth::client_token': token,
	})

	// CORS: specify $SERVER_HOST as an allowed origin
	const response = await resolve(event)
	response.headers.append('Access-Control-Allow-Origin', SERVER_HOST)

	return response
}
