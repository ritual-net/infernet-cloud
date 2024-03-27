import axios from 'axios';
import type { DockerHubCreds, DockerHubHeaders, DockerHubRepo, DockerHubOrg } from '$/types/docker';

const BASEURL = 'https://hub.docker.com/v2';

export class DockerHubClient {
	private headers!: DockerHubHeaders;

	/**
	 * Initialize headers for DockerHub API requests.
	 */
	private async authenticate(creds: DockerHubCreds): Promise<void> {
		const authUrl = `${BASEURL}/users/login/`;
		try {
			const response = await axios.post(authUrl, creds);
			const dockerHubToken = response.data.token;
			this.headers = {
				repoHeaders: {
					Authorization: `JWT ${dockerHubToken}`,
				},
				orgHeaders: {
					Authorization: `Bearer ${dockerHubToken}`,
				},
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
	private async getTag(repoName: string, useHeaders: boolean = false): Promise<string> {
		const tagsUrl = `${BASEURL}/repositories/${repoName}/tags/?page_size=100`;
		try {
			const response = useHeaders
				? await axios.get(tagsUrl, { headers: this.headers.repoHeaders })
				: await axios.get(tagsUrl);

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
	private async getRepos(ownerName: string, useHeaders: boolean = false): Promise<string[]> {
		const repoUrl = `${BASEURL}/repositories/${ownerName}/?page_size=100`;
		try {
			const response = useHeaders
				? await axios.get(repoUrl, { headers: this.headers.repoHeaders })
				: await axios.get(repoUrl);

			const repos = response.data.results;
			return await Promise.all(
				repos.map(async (repo: DockerHubRepo) => {
					const repoName = `${repo.namespace}/${repo.name}`;
					const tag = useHeaders
						? await this.getTag(repoName, useHeaders)
						: await this.getTag(repoName);
					return tag ? `${repoName}:${tag}` : repoName;
				})
			);
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
		const orgsUrl = `${BASEURL}/user/orgs/`;
		try {
			const response = await axios.get(orgsUrl, { headers: this.headers.orgHeaders });
			const orgs = response.data.results.map((org: DockerHubOrg) => org.orgname);
			return orgs;
		} catch (error) {
			throw new Error(`Failed to fetch organizations: ${(error as Error).message}`);
		}
	}

	/**
	 * Retrieves all repos owned by user or an organization the user is in.
	 *
	 * @returns Flat array of tagged repo ids.
	 */
	public async getAllTaggedRepos(creds: DockerHubCreds): Promise<string[]> {
		// Authenticate with DockerHub
		await this.authenticate(creds);

		// Get all orgs that user belongs to
		const orgs = await this.getOrgs();

		// Get all repos for user and orgs
		const allRepos = await Promise.all([
			this.getRepos(creds.username, true),
			...orgs.map((org) => this.getRepos(org, true)),
		]);
		return allRepos.flat();
	}

	/**
	 * Retrieves all public ritualnetwork repos.
	 *
	 * @returns Flat array of tagged repo ids.
	 */
	public async getRitualImages(): Promise<string[]> {
		const ritualRepos = await this.getRepos('ritualnetwork');
		return ritualRepos;
	}
}
