import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL, generatePKCE } from '$/lib/auth';

/**
 * Handles sign in with email and password.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email', 'password', and 'provider'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request }) => {
	const body = await request.json();

	const pkce = generatePKCE();
	const { email, password, provider } = body;

	if (!email || !password || !provider) {
		return error(
			400,
			`Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys, but got: ${JSON.stringify(
				body
			)}`
		);
	}

	const authenticateUrl = new URL('authenticate', EDGEDB_AUTH_BASE_URL);
	const authenticateResponse = await fetch(authenticateUrl.href, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			challenge: pkce.challenge,
			email,
			password,
			provider,
		}),
	});

	if (!authenticateResponse.ok) {
		const text = await authenticateResponse.text();
		return error(400, `Error from the auth server: ${text}`);
	}

	const { code } = await authenticateResponse.json();

	const tokenUrl = new URL('token', EDGEDB_AUTH_BASE_URL);
	tokenUrl.searchParams.set('code', code);
	tokenUrl.searchParams.set('verifier', pkce.verifier);
	const tokenResponse = await fetch(tokenUrl.href, {
		method: 'get',
	});

	if (!tokenResponse.ok) {
		const text = await tokenResponse.text();
		return error(400, `Error from the auth server: ${text}`);
	}

	const { auth_token } = await tokenResponse.json();
	const headers = new Headers({
		'Set-Cookie': `edgedb-auth-token=${auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
	});

	return new Response(null, { status: 204, headers });
};
