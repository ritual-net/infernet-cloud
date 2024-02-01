import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL } from '$/lib/auth/pkce';

/**
 * Handles the link in the email verification flow.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param request - The request object containing 'verification_token'.
 * @returns The response object.
 */
export const GET: RequestHandler = async ({ cookies, request }) => {
	const url = new URL(request.url);
	const verification_token = url.searchParams.get('verification_token');
	if (!verification_token) {
		return error(
			400,
			`Verify request is missing 'verification_token' search param. The verification email is malformed.`
		);
	}

	const verifier = cookies.get('edgedb-pkce-verifier');
	if (!verifier) {
		return error(
			400,
			`Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`
		);
	}

	const verifyUrl = new URL('verify', EDGEDB_AUTH_BASE_URL);
	const verifyResponse = await fetch(verifyUrl.href, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			verification_token,
			verifier,
			provider: 'builtin::local_emailpassword',
		}),
	});

	if (!verifyResponse.ok) {
		const text = await verifyResponse.text();
		return error(400, `Error from the auth server: ${text}`);
	}

	const { code } = await verifyResponse.json();

	const tokenUrl = new URL('token', EDGEDB_AUTH_BASE_URL);
	tokenUrl.searchParams.set('code', code);
	tokenUrl.searchParams.set('verifier', verifier);
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
