import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL } from '$/lib/auth';

/**
 * Send new password with reset token to EdgeDB Auth.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'reset_token' and 'password'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const { reset_token, password } = (await request.json()) as {
		reset_token: string;
		password: string;
	};

	if (!reset_token || !password) {
		return error(
			400,
			"Request body malformed. Expected JSON body with 'reset_token' and 'password' keys"
		);
	}

	const provider = 'builtin::local_emailpassword';
	const verifier = cookies.get('edgedb-pkce-verifier');
	if (!verifier) {
		return error(
			400,
			`Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`
		);
	}

	const resetUrl = new URL('reset-password', EDGEDB_AUTH_BASE_URL);
	const resetResponse = await fetch(resetUrl.href, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			reset_token,
			provider,
			password,
		}),
	});

	if (!resetResponse.ok) {
		const text = await resetResponse.text();
		return error(400, `Error from the auth server: ${text}`);
	}

	const { code } = await resetResponse.json();
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
