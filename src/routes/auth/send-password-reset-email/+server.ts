import { error, type RequestHandler } from '@sveltejs/kit'
import { EDGEDB_AUTH_COOKIES, EDGEDB_AUTH_URLS, AUTH_CALLBACK_URLS, generatePKCE } from '$/lib/auth'

/**
 * Request a password reset for an email.
 *
 * @param fetch - The fetch function.
 * @param request - The request object containing 'email'.
 * @returns The response object.
 */
export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
	const { email } = (await request.json()) as { email: string }

	const provider = 'builtin::local_emailpassword'
	const pkce = generatePKCE()

	const sendResetResponse = await fetch(
		EDGEDB_AUTH_URLS.SEND_RESET_PASSWORD_EMAIL,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				provider,
				reset_url: AUTH_CALLBACK_URLS.RESET_PASSWORD,
				challenge: pkce.challenge,
			}),
		},
	)

	if (!sendResetResponse.ok) {
		const result = await sendResetResponse
			.text()
			.then((text): string => {
				try {
					const json = JSON.parse(text)
					console.error(json)
					return JSON.parse(text).error.message as string
				} catch (e) {
					console.error(text)
					return text
				}
			})

		return error(500, result)
	}

	const { email_sent } = await sendResetResponse.json()

	cookies.set(
		EDGEDB_AUTH_COOKIES.PKCE_VERIFIER,
		pkce.verifier,
		{
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 24 * 60 * 60,
		},
	)

	return new Response(`Reset email sent to '${email_sent}'`)
}
