import crypto from 'node:crypto';
import { EDGEDB_BASE_URL, SERVER_HOST } from '$env/static/private';

/**
 * You can get EDGEDB_BASE_URL by running `edgedb instance credentials`.
 * Value should be:
 * `${protocol}://${host}:${port}/db/${database}`
 */
export const EDGEDB_AUTH_URLS = {
	GET_TOKEN: `${EDGEDB_BASE_URL}/ext/auth/token`,
	REGISTER: `${EDGEDB_BASE_URL}/ext/auth/register`,
	VERIFY: `${EDGEDB_BASE_URL}/ext/auth/verify`,
	SIGN_IN: `${EDGEDB_BASE_URL}/ext/auth/authenticate`,
	RESET_PASSWORD: `${EDGEDB_BASE_URL}/ext/auth/reset-password`,
	SEND_RESET_PASSWORD_EMAIL: `${EDGEDB_BASE_URL}/ext/auth/send-reset-email`,
}

export const SERVER_AUTH_CALLBACK_URLS = {
	RESET_PASSWORD: `${SERVER_HOST}/auth/reset-password`,
	VERIFY: `${SERVER_HOST}/auth/verify`,
}

export enum EDGEDB_AUTH_COOKIES {
	AUTH_TOKEN = 'edgedb-auth-token',
	PKCE_VERIFIER = 'edgedb-pkce-verifier',
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
