import { error, type RequestHandler } from '@sveltejs/kit';
import { createClient, e } from '$/lib/db';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST, generatePKCE } from '$/lib/auth';

/**
 * Handles sign up with email and password.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email', 'name', 'password', and
 *   'provider'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({
	cookies,
	fetch,
	request,
}) => {
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

	const registerUrl = new URL('register', EDGEDB_AUTH_BASE_URL);
	const registerResponse = await fetch(registerUrl.href, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			challenge: pkce.challenge,
			email,
			password,
			provider,
			verify_url: `${SERVER_HOST}/auth/verify`,
		}),
	});

	if(!registerResponse.ok){
		const result = await registerResponse.text();

		try {
			return error(500, `Error from the auth server: ${JSON.parse(result).error.message}`);
		}catch(e){
			return error(500, `Error from the auth server: ${result}`);
		}
	}

	// Get the identity from the auth server
	const client = createClient();
	const emailFactor = await e
		.select(e.ext.auth.EmailPasswordFactor, (emailPassword) => ({
			identity: {
				id: true,
			},
			filter: e.op(emailPassword.email, '=', email),
		}))
		.run(client);
	if (!emailFactor) {
		return error(400, `Email already registered`);
	}

	// Create a new user in the database
	await e
		.insert(e.User, {
			email,
			name,
			identity: e.select(e.ext.auth.Identity, () => ({
				filter_single: { id: emailFactor[0].identity.id },
			})),
		})
		.run(client);

	cookies.set('edgedb-pkce-verifier', pkce.verifier, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'strict'
	});

	return new Response(null, { status: 204 });
};
