import crypto from 'node:crypto';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST } from '$env/static/private';

/**
 * You can get EDGEDB_AUTH_BASE_URL by running `edgedb instance credentials`.
 * Value should be:
 * `${protocol}://${host}:${port}/db/${database}/ext/auth
 */
export const EDGEDB_AUTH_URLS = {
	GET_TOKEN: `${EDGEDB_AUTH_BASE_URL}/token`,
	REGISTER: `${EDGEDB_AUTH_BASE_URL}/register`,
	VERIFY: `${EDGEDB_AUTH_BASE_URL}/verify`,
	SIGN_IN: `${EDGEDB_AUTH_BASE_URL}/authenticate`,
	RESET_PASSWORD: `${EDGEDB_AUTH_BASE_URL}/reset-password`,
	SEND_RESET_PASSWORD_EMAIL: `${EDGEDB_AUTH_BASE_URL}/send-reset-email`,
}

export const SERVER_AUTH_CALLBACK_URLS = {
	RESET_PASSWORD: `${SERVER_HOST}/auth/reset-password`,
	VERIFY: `${SERVER_HOST}/auth/verify`,
}


/**
 * Generate a random Base64 url-encoded string, and derive a "challenge"
 * string from that string to use as proof that the request for a token
 * later is made from the same user agent that made the original request
 *
 * @returns {Object} The verifier and challenge strings
 */
export const generatePKCE = () => {
	const verifier = crypto.randomBytes(32).toString('base64url');

	const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');

	return { verifier, challenge };
}
