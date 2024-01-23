import axios from 'axios';
import type { Creds, DockerHubHeaders, DockerHubRepo, DockerHubOrg } from '$types/docker';

export class DockerHubClient {
	private creds: Creds;
	private baseUrl: string;
	private headers!: DockerHubHeaders;

	constructor(creds: Creds) {
		this.creds = creds;
		this.baseUrl = 'https://hub.docker.com/v2';
	}

	/**
	 * Initialize headers for DockerHub API requests.
	 */
	private async authenticate(): Promise<void> {
		const authUrl = `${this.baseUrl}/users/login/`;
		try {
			const response = await axios.post(authUrl, this.creds);
			const dockerHubToken = response.data.token;
			this.headers = {
				repoHeaders: {
					Authorization: `JWT ${dockerHubToken}`
				},
				orgHeaders: {
					Authorization: `Bearer ${dockerHubToken}`
				}
			} as DockerHubHeaders;
		} catch (error) {
			throw new Error(`Failed to authenticate with DockerHub: ${(error as Error).message}`);
		}
	}

	/**
	 * Retrieves the latest tag of a repo.
	 *
	 * @param repoName - full name of repo: owner/repo-name
	 * @returns Tag string.
	 */
	private async getTag(repoName: string): Promise<string> {
		const tagsUrl = `${this.baseUrl}/repositories/${repoName}/tags/?page_size=100`;
		try {
			const response = await axios.get(tagsUrl, { headers: this.headers.repoHeaders });
			const tagsList = response.data.results;
			return tagsList.length > 0 ? tagsList[0].name : '';
		} catch (error) {
			throw new Error(
				`Failed to fetch tags for repository ${repoName}: ${(error as Error).message}`
			);
		}
	}

	/**
	 * Retrieves all repos (public and private) belonging to a given owner (indiv. user or org).
	 *
	 * @param ownerName - DockerHub repo owner id.
	 * @returns Flat array of tagged repo ids.
	 */
	private async getRepos(ownerName: string): Promise<string[]> {
		const repoUrl = `${this.baseUrl}/repositories/${ownerName}/?page_size=100`;
		try {
			const response = await axios.get(repoUrl, { headers: this.headers.repoHeaders });
			const repos = response.data.results;
			const repoNames = await Promise.all(
				repos.map(async (repo: DockerHubRepo) => {
					const repoName = `${repo.namespace}/${repo.name}`;
					const tag = await this.getTag(repoName);
					return tag ? `${repoName}:${tag}` : repoName;
				})
			);
			return repoNames;
		} catch (error) {
			throw new Error(
				`Failed to fetch repositories for owner ${ownerName}: ${(error as Error).message}`
			);
		}
	}

	/**
	 * Retrieves all DockerHub organizations that user belongs to.
	 *
	 * @returns Flat array of organization ids.
	 */
	private async getOrgs(): Promise<string[]> {
		const orgsUrl = `${this.baseUrl}/user/orgs/`;
		try {
			const response = await axios.get(orgsUrl, { headers: this.headers.orgHeaders });
			return response.data.results.map((org: DockerHubOrg) => org.orgname);
		} catch (error) {
			throw new Error(`Failed to fetch organizations: ${(error as Error).message}`);
		}
	}

	/**
	 * Retrieves all repos (public and private) that user has access to.
	 *
	 * @returns Flat array of tagged repo ids.
	 */
	public async getAllTaggedRepos(): Promise<string[]> {
		await this.authenticate();
		const userReposPromise = this.getRepos(this.creds.username);
		const orgs = await this.getOrgs();
		const orgReposPromises = orgs.map((org) => this.getRepos(org));
		const allRepos = await Promise.all([userReposPromise, ...orgReposPromises]);
		return allRepos.flat();
	}
}
