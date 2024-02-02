import { createClient } from 'edgedb';
import { error, type RequestHandler } from '@sveltejs/kit';
import { e } from '$/lib/db';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST, generatePKCE } from '$/lib/auth';

/**
 * Handles sign up with email and password.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email', 'name', 'password', and
 *   'provider'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request }) => {
	const body = await request.json();

	const pkce = generatePKCE();
	const { email, name, password, provider } = body;

	if (!email || !name || !password || !provider) {
		return error(
			400,
			`Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys, but got: ${JSON.stringify(
				body
			)}`
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

	if (!registerResponse.ok) {
		const text = await registerResponse.text();
		return error(400, `Error from the auth server: ${text}`);
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

	// Set cookies and other headers as needed
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`
	);

	return new Response(null, { status: 204, headers });
};
