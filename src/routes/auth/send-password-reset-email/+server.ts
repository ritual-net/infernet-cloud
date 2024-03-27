import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST, generatePKCE } from '$/lib/auth';

/**
 * Request a password reset for an email.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
	const { email } = (await request.json()) as { email: string };

	// TODO: Needs to change
	const reset_url = `${SERVER_HOST}/auth/ui/reset-password`;
	const provider = 'builtin::local_emailpassword';
	const pkce = generatePKCE();

	const sendResetUrl = new URL('send-reset-email', EDGEDB_AUTH_BASE_URL);
	const sendResetResponse = await fetch(sendResetUrl.href, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			provider,
			reset_url,
			challenge: pkce.challenge,
		}),
	});

	if (!sendResetResponse.ok) {
		const result = await sendResetResponse
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

	const { email_sent } = await sendResetResponse.json();

	cookies.set('edgedb-pkce-verifier', pkce.verifier, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'strict',
		maxAge: 24 * 60 * 60,
	});

	return new Response(`Reset email sent to '${email_sent}'`);
};
