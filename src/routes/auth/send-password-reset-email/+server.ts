import { error, type RequestHandler } from '@sveltejs/kit';
import { EDGEDB_AUTH_BASE_URL, SERVER_PORT, generatePKCE } from '$/lib/auth/pkce';

/**
 * Request a password reset for an email.
 *
 * @param request - The request object containing 'email'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { email } = body;

	// TODO: Needs to change
	const reset_url = `http://localhost:${SERVER_PORT}/auth/ui/reset-password`;
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
