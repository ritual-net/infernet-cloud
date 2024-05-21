import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_URLS } from '$/lib/auth';

/**
 * Send new password with reset token to EdgeDB Auth.
 *
 * @param cookies - The cookies object contains the 'edgedb-pkce-verifier' cookie.
 * @param fetch - The fetch function.
 * @param request - The request object containing 'reset_token' and 'password'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({
	cookies,
	fetch,
	request,
}) => {
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

	const resetResponse = await fetch(
		EDGEDB_AUTH_URLS.RESET_PASSWORD,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				reset_token,
				provider,
				password,
			}),
		}
	);

	if (!resetResponse.ok) {
		const result = await resetResponse
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

	const { code } = await resetResponse.json();

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

	const { auth_token } = await tokenResponse.json();

	cookies.set('edgedb-auth-token', auth_token, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 24 * 60 * 60,
	});

	return new Response(null, { status: 204 });
};
