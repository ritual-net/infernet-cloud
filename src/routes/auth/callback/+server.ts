import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL } from '$/lib/auth';

/**
 * Handles the PKCE callback and exchanges the `code` and `verifier
 * for an auth_token, setting the auth_token as an HttpOnly cookie.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'code'.
 */
export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
	const url = new URL(request.url);

	const code = url.searchParams.get('code');
	if (!code) {
		const e = url.searchParams.get('error');
		return error(
			400,
			`OAuth callback is missing 'code'. OAuth provider responded with error: ${e}`
		);
	}

	const verifier = cookies.get('edgedb-pkce-verifier');
	if (!verifier) {
		return error(
			400,
			'Could not find "verifier" in the cookie store. Is this the same user agent/browser that started the authorization flow?'
		);
	}

	const codeExchangeUrl = new URL('token', EDGEDB_AUTH_BASE_URL);
	codeExchangeUrl.searchParams.set('code', code);
	codeExchangeUrl.searchParams.set('verifier', verifier);
	const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
		method: 'GET',
	});

	if(!codeExchangeResponse.ok){
		const result = await codeExchangeResponse.text();

		try {
			return error(500, `Error from the auth server: ${JSON.parse(result).error.message}`);
		}catch(e){
			return error(500, `Error from the auth server: ${result}`);
		}
	}

	const { auth_token } = await codeExchangeResponse.json();
	const headers = new Headers({
		'Set-Cookie': `edgedb-auth-token=${auth_token}; Path=/; HttpOnly`,
	});

	return new Response(null, { status: 204, headers });
};
