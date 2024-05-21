import { json, error, type RequestHandler } from '@sveltejs/kit';
import { createClient, e } from '$/lib/db';
import { EDGEDB_AUTH_COOKIES, EDGEDB_AUTH_URLS, AUTH_CALLBACK_URLS, generatePKCE } from '$/lib/auth';

/**
 * Handles sign up with email and password.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email', 'name', 'password', and
 *   'provider'.
 * @returns The created user ID.
 */
export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
	const pkce = generatePKCE();
	const { email, name, password, provider } = (await request.json()) as {
		email: string;
		name: string;
		password: string;
		provider: string;
	};

	if (!email || !name || !password || !provider) {
		return error(
			400,
			"Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys"
		);
	}

	const registerResponse = await fetch(
		EDGEDB_AUTH_URLS.REGISTER,
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
				verify_url: AUTH_CALLBACK_URLS.VERIFY,
			}),
		}
	);

	if (!registerResponse.ok) {
		const result = await registerResponse
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
			})

		return error(400, result);
	}

	const registerResult = await registerResponse.json() as {
		code: string,
		provider: string,
	}

	const pkceChallengeId = registerResult.code
	
	// Create a new user in the database
	const client = createClient();

	const user = await e.insert(e.User, {
		email,
		name,
		identity: e.assert_single(
			e.op(
				'distinct',
				e.set(
					e.select(e.ext.auth.PKCEChallenge, () => ({
						filter_single: { id: pkceChallengeId },
					})).identity,

					e.select(e.ext.auth.EmailPasswordFactor, (emailPasswordFactor) => ({
						filter_single: e.op(emailPasswordFactor.email, '=', email),
					})).identity,					
				),
			),
		),
	})
		.run(client);
	
	if(!user)
		return error(500, `Failed to create user.`)

	cookies.set(
		EDGEDB_AUTH_COOKIES.PKCE_VERIFIER,
		pkce.verifier,
		{
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60,
		}
	);

	return json({
		user
	})
};
