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
	const pkce = generatePKCE();
	const { email, password, provider } = (await request.json()) as {
		email: string;
		password: string;
		provider: string;
	};

	if (!email || !password || !provider) {
		return error(
			400,
			"Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys"
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

	if(!authenticateResponse.ok){
		const result = await authenticateResponse.text();

		try {
			return error(500, `Error from the auth server: ${JSON.parse(result).error.message}`);
		}catch(e){
			return error(500, `Error from the auth server: ${result}`);
		}
	}

	const { code } = (await authenticateResponse.json()) as { code: string };

	const tokenUrl = new URL('token', EDGEDB_AUTH_BASE_URL);
	tokenUrl.searchParams.set('code', code);
	tokenUrl.searchParams.set('verifier', pkce.verifier);
	const tokenResponse = await fetch(tokenUrl.href, {
		method: 'get',
	});

	if(!tokenResponse.ok){
		const result = await tokenResponse.text();

		try {
			return error(500, `Error from the auth server: ${JSON.parse(result).error.message}`);
		}catch(e){
			return error(500, `Error from the auth server: ${result}`);
		}
	}

	const { auth_token } = (await tokenResponse.json()) as { auth_token: string };
	const headers = new Headers({
		'Set-Cookie': `edgedb-auth-token=${auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
	});

	return new Response(null, { status: 204, headers });
};
