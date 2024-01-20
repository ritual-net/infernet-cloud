import axios from 'axios';
import { config } from 'dotenv';
config();

export type Creds = {
	user: string;
	repoHeaders: {
		Authorization: string;
	};
	orgHeaders: {
		Authorization: string;
	};
};

/**
 * Retrieve username and api headers containing auth token.
 * 
 * @returns Creds object.
 */
export async function getCreds(): Promise<Creds> {
	const username = process.env.DOCKER_USERNAME;
	const pwd = process.env.DOCKER_PWD;

	if (!username || !pwd) {
		throw new Error('DOCKER_USERNAME or DOCKER_PWD environment variables are not set');
	}

	const authUrl = 'https://hub.docker.com/v2/users/login/';
	const authData = {
		username: username,
		password: pwd
	};

	return axios
		.post(authUrl, authData)
		.then((auth_response) => {
			const dockerHubToken = auth_response.data.token;
			const creds: Creds = {
				user: username,
				repoHeaders: {
					Authorization: `JWT ${dockerHubToken}`
				},
				orgHeaders: {
					Authorization: `Bearer ${dockerHubToken}`
				}
			};
			return creds;
		})
		.catch((error) => {
			throw new Error(`Failed to authenticate with Docker Hub: ${error.message}`);
		});
}

/**
 * Retrieves the latest tag of a repo.
 * 
 * @param repoName - full name of repo: owner/repo-name
 * @param repoHeaders - headers containing auth token
 * @returns Tag string.
 */
export async function getTag(repoName: string, repoHeaders: Creds['repoHeaders']): Promise<string> {
	const tagsUrl = `https://hub.docker.com/v2/repositories/${repoName}/tags/?page_size=100`;
	return axios
		.get(tagsUrl, { headers: repoHeaders })
		.then((tagsResponse) => {
			const tagsList = tagsResponse.data.results;
			if (tagsList.length > 0) {
				return tagsList[0].name;
			} else {
				return '';
			}
		})
		.catch((error) => {
			throw new Error(`Failed to fetch tags for repository ${repoName}: ${error.message}`);
		});
}

/**
 * Retrieves all repos (public and private) belonging to a given owner (indiv. user or org).
 * 
 * @param ownerName - DockerHub repo owner id
 * @param repoHeaders - headers containing auth token
 * @returns Flat array of tagged repo ids.
 */
export async function getRepos(
	ownerName: string,
	repoHeaders: Creds['repoHeaders']
): Promise<string[]> {
	const repoUrl = `https://hub.docker.com/v2/repositories/${ownerName}/?page_size=100`;
	return axios
		.get(repoUrl, { headers: repoHeaders })
		.then(async (userReposResponse) => {
			const repos = userReposResponse.data.results;
			const repoNames = await Promise.all(
				repos.map(async (repo) => {
					const repoName = `${repo.namespace}/${repo.name}`;
					const tag = await getTag(repoName, repoHeaders);
					return tag ? `${repoName}:${tag}` : repoName;
				})
			);
			return repoNames;
		})
		.catch((error) => {
			throw new Error(`Failed to fetch repositories for owner ${ownerName}: ${error.message}`);
		});
}

/**
 * Retrieves all DockerHub orgs logged in user belongs to.
 * 
 * @param orgHeaders - headers containing auth token
 * @returns Flat array of organization ids.
 */
export async function getOrgs(orgHeaders: Creds['orgHeaders']): Promise<string[]> {
	const orgsUrl = 'https://hub.docker.com/v2/user/orgs/';
	return axios
		.get(orgsUrl, { headers: orgHeaders })
		.then((response) => {
			const orgsList = response.data.results.map(org => org.orgname);
			return orgsList;
		})
		.catch((error) => {
			throw new Error(`Failed to fetch organizations: ${error.message}`);
		});
}
