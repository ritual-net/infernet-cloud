import { createClient } from '$schema/edgeql-js';
import { error, type Handle } from '@sveltejs/kit';

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
export const handle: Handle = async ({ event, resolve }) =>{
	// Allow requests to the auth server
	if (event.url.pathname.startsWith('/auth')) {
		return await resolve(event);
	}

	// Extract token from cookie
	const token = event.cookies.get('edgedb-auth-token');
	if (!token) {
		return error(
			400,
			'Could not find "token" in the cookie store. Is this the same user agent/browser that started the authorization flow?'
		);
	}

	// Attach client to the event
	event.locals.client = createClient().withGlobals({
		'ext::auth::client_token': token,
	});
	return await resolve(event);
}
