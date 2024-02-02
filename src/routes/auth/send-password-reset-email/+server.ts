import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST, generatePKCE } from '$/lib/auth';

/**
 * Request a password reset for an email.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request }) => {
	const body = await request.json();
	const { email } = body;

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
		const text = await sendResetResponse.text();
		return error(400, `Error from the auth server: ${text}`);
	}

	const { email_sent } = await sendResetResponse.json();

	// Set cookies and other headers as needed
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		`edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`
	);

	return new Response(`Reset email sent to '${email_sent}'`, { headers });
};
