import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_COOKIES, EDGEDB_AUTH_URLS, generatePKCE } from '$/lib/auth';

/**
 * Handles sign in with email and password.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email', 'password', and 'provider'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
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

	const authenticateResponse = await fetch(
		EDGEDB_AUTH_URLS.SIGN_IN,
		{
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
		}
	);

	if (!authenticateResponse.ok) {
		const result = await authenticateResponse
			.text()
			.then((text): string => {
				try {
					const json = JSON.parse(text)
					console.error(json)
					return JSON.parse(text).error.message as string
				}catch(e){
					console.error(text)
					return text
				}
			});

		return error(500, result);
	}

	const { code } = (await authenticateResponse.json()) as { code: string };

	const tokenResponse = await fetch(
		`${EDGEDB_AUTH_URLS.GET_TOKEN}?${new URLSearchParams({
			code,
			verifier: pkce.verifier,
		})}`
	);

	if (!tokenResponse.ok) {
		const result = await tokenResponse
			.text()
			.then((text): string => {
				try {
					const json = JSON.parse(text)
					console.error(json)
					return JSON.parse(text).error.message as string
				}catch(e){
					console.error(text)
					return text
				}
			});

		return error(500, result);
	}

	const result = await tokenResponse.text();

	try {
		const { auth_token } = JSON.parse(result) as { auth_token: string };

		cookies.set(
			EDGEDB_AUTH_COOKIES.AUTH_TOKEN,
			auth_token,
			{
				httpOnly: true,
				path: '/',
				secure: true,
				sameSite: 'strict',
				maxAge: 24 * 60 * 60,
			}
		);

		return new Response(null, { status: 204 });
	} catch (e) {
		return error(500, `Error from the auth server: ${result}`);
	}
};
