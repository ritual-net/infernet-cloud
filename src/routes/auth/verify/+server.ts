import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_COOKIES, EDGEDB_AUTH_URLS } from '$lib/auth';
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'

/**
 * Handles the link in the email verification flow.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'verification_token'.
 * @returns The response object.
 */
export const GET: RequestHandler = async ({
	url,
	cookies,
	fetch,
}) => {
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

	const verifier = cookies.get(EDGEDB_AUTH_COOKIES.PKCE_VERIFIER);
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

	const verifyResponse = await fetch(
		EDGEDB_AUTH_URLS.VERIFY,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				verification_token,
				verifier,
				provider: 'builtin::local_emailpassword',
			}),
		},
	);

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

	const tokenResponse = await fetch(
		`${EDGEDB_AUTH_URLS.GET_TOKEN}?${new URLSearchParams({
			code,
			verifier,
		})}`,
		{
			method: 'get',
		}
	);

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
