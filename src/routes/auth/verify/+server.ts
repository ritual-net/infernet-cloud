import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL } from '$lib/auth';
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

/**
 * Handles the link in the email verification flow.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'verification_token'.
 * @returns The response object.
 */
export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
	const url = new URL(request.url);
	const verification_token = url.searchParams.get('verification_token');
	if (!verification_token) {
		// return error(
		// 	400,
		// 	`Verify request is missing 'verification_token' search param. The verification email is malformed.`
		// );

		return flashRedirect(
			303,
			'/login',
			{
				type: 'error',
				message: {
					title: `Couldn't verify your email address.`,
					description: `Verify request is missing 'verification_token' search param. The verification email is malformed.`,
				},
			},
			cookies,
		)
	}

	const verifier = cookies.get('edgedb-pkce-verifier');
	if (!verifier) {
		// return error(
		// 	400,
		// 	`Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`
		// );

		return flashRedirect(
			303,
			'/login',
			{
				type: 'error',
				message: {
					title: `Couldn't verify your email address.`,
					description: `Make sure you're opening the link in the same browser you used to sign up.`,
				},
			},
			cookies,
		)
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
		const result = await verifyResponse.text();

		// return error(400, `Error from the auth server: ${result}`);

		return flashRedirect(
			303,
			'/login',
			{
				type: 'error',
				message: {
					title: `Couldn't verify your email address.`,
					description: `Error from the auth server: ${result}`,
				},
			},
			cookies,
		)
	}

	const { code } = (await verifyResponse.json()) as { code: string };

	const tokenUrl = new URL('token', EDGEDB_AUTH_BASE_URL);
	tokenUrl.searchParams.set('code', code);
	tokenUrl.searchParams.set('verifier', verifier);
	const tokenResponse = await fetch(tokenUrl.href, {
		method: 'get',
	});

	if (!tokenResponse.ok) {
		const result = await tokenResponse.text();

		// return error(400, `Error from the auth server: ${result}`);

		return flashRedirect(
			303,
			'/login',
			{
				type: 'error',
				message: {
					title: `Couldn't verify your email address.`,
					description: `Error from the auth server: ${result}`,
				},
			},
			cookies,
		)
	}

	const { auth_token } = (await tokenResponse.json()) as { auth_token: string };

	cookies.set('edgedb-auth-token', auth_token, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'strict',
	});

	// return new Response(null, { status: 204 });

	return flashRedirect(
		303,
		'/',
		{
			type: 'success',
			message: {
				title: `Email address verified!`,
			},
		},
		cookies,
	)
};
