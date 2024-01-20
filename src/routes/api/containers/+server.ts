import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getCreds, getRepos, getOrgs } from '$utils/docker'

/**
 * Fetch all private and public containers user has access to.
 * 
 * @returns Flat array of container ids (including tag).
 */
export const GET: RequestHandler = async () => {
    const creds = await getCreds();
    const userReposPromise = getRepos(creds.user, creds.repoHeaders);
    const orgs = await getOrgs(creds.orgHeaders);
    const orgReposPromises = orgs.map(org => getRepos(org, creds.repoHeaders));
    const allRepos = await Promise.all([userReposPromise, ...orgReposPromises]);
    return json(allRepos.flat());
};