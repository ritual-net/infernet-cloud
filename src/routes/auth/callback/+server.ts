import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_URLS, EDGEDB_AUTH_COOKIES } from '$/lib/auth';

/**
 * Handles the PKCE callback and exchanges the `code` and `verifier
 * for an auth_token, setting the auth_token as an HttpOnly cookie.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'code'.
 */
export const GET: RequestHandler = async ({
	url,
	cookies,
	fetch,
}) => {
	const code = url.searchParams.get('code');
	if (!code) {
		const _error = url.searchParams.get('error');

		return error(
			400,
			`OAuth callback is missing 'code'. OAuth provider responded with error: ${_error}`
		);
	}

	const verifier = cookies.get(EDGEDB_AUTH_COOKIES.PKCE_VERIFIER);
	if (!verifier) {
		return error(
			400,
			'Could not find "verifier" in the cookie store. Is this the same user agent/browser that started the authorization flow?'
		);
	}

	const codeExchangeResponse = await fetch(
		`${EDGEDB_AUTH_URLS.GET_TOKEN}?${new URLSearchParams({
			code,
			verifier,
		})}`
	);

	if (!codeExchangeResponse.ok) {
		const result = await codeExchangeResponse.text();

		try {
			return error(500, `Error from the auth server: ${JSON.parse(result).error.message}`);
		} catch (e) {
			return error(500, `Error from the auth server: ${result}`);
		}
	}

	const { auth_token } = await codeExchangeResponse.json();

	cookies.set(
		EDGEDB_AUTH_COOKIES.AUTH_TOKEN,
		auth_token,
		{
			path: '/',
			httpOnly: true,
			maxAge: 24 * 60 * 60,
		}
	);

	return new Response(null, { status: 204 });
};
