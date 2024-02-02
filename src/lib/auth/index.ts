import crypto from 'node:crypto';
import { EDGEDB_AUTH_BASE_URL, SERVER_HOST, SERVER_PORT } from '$env/static/private';

/**
 * You can get EDGEDB_AUTH_BASE_URL by running `edgedb instance credentials`.
 * Value should be:
 * `${protocol}://${host}:${port}/db/${database}/ext/auth/
 */
export { EDGEDB_AUTH_BASE_URL, SERVER_HOST, SERVER_PORT };

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
};
