import type { DockerHubCreds, DockerHubHeaders, DockerHubRepo, DockerHubOrg } from '$/types/docker'
import { isTruthy } from '../utils/isTruthy'

const BASEURL = 'https://hub.docker.com/v2'

export class DockerHubClient {
	private headers!: DockerHubHeaders

	/**
	 * Initialize headers for DockerHub API requests.
	 */
	private async authenticate(creds: DockerHubCreds): Promise<void> {
		const authUrl = `${BASEURL}/users/login/`
		try {
			const response = await fetch(authUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(creds),
			})
			const data = await response.json()
			const dockerHubToken = data.token
			this.headers = {
				repoHeaders: {
					Authorization: `JWT ${dockerHubToken}`,
				},
				orgHeaders: {
					Authorization: `Bearer ${dockerHubToken}`,
				},
			} as DockerHubHeaders
		} catch (error) {
			throw new Error(`Failed to authenticate with DockerHub: ${(error as Error).message}`)
		}
	}

	/**
	 * Retrieves the latest tag of a repo.
	 *
	 * @param repoName - full name of repo: owner/repo-name
	 * @returns Tag string.
	 */
	private async getTag(repoName: string, useHeaders: boolean = false): Promise<string> {
		const tagsUrl = `${BASEURL}/repositories/${repoName}/tags/?page_size=100`
		try {
			const response = useHeaders
				? await fetch(tagsUrl, { headers: this.headers.repoHeaders })
				: await fetch(tagsUrl)
			const data = await response.json()
			const tagsList = data.results
			return tagsList.length > 0 ? tagsList[0].name : ''
		} catch (error) {
			throw new Error(
				`Failed to fetch tags for repository ${repoName}: ${(error as Error).message}`,
			)
		}
	}

	/**
	 * Retrieves all repos (public and private) belonging to a given owner (indiv. user or org).
	 *
	 * @param ownerName - DockerHub repo owner id.
	 * @returns Flat array of tagged repo ids.
	 */
	private async getRepos(ownerName: string, useHeaders: boolean = false): Promise<string[]> {
		const repoUrl = `${BASEURL}/repositories/${ownerName}/?page_size=100`

		const { results: repos } = await fetch(
			repoUrl,
			useHeaders ? { headers: this.headers.repoHeaders } : undefined
		)
			.then(response => response.json())

		return (
			await Promise.all(
				repos
					.map(async (repo: DockerHubRepo) => {
						const repoName = `${repo.namespace}/${repo.name}`

						try {
							const tag = await this.getTag(repoName, useHeaders)
							return tag ? `${repoName}:${tag}` : repoName
						} catch (error) {
							console.error(error)
						}
					}),
			)
		)
			.filter(isTruthy)
	}

	/**
	 * Retrieves all DockerHub organizations that user belongs to.
	 *
	 * @returns Flat array of organization ids.
	 */
	private async getOrgs(): Promise<string[]> {
		const orgsUrl = `${BASEURL}/user/orgs/`
		try {
			const response = await fetch(orgsUrl, { headers: this.headers.orgHeaders })
			const data = await response.json()
			const orgs = data.results.map((org: DockerHubOrg) => org.orgname)
			return orgs
		} catch (error) {
			throw new Error(`Failed to fetch organizations: ${(error as Error).message}`)
		}
	}

	/**
	 * Retrieves all repos owned by user or an organization the user is in.
	 *
	 * @returns Flat array of tagged repo ids.
	 */
	public async getAllTaggedRepos(creds: DockerHubCreds): Promise<string[]> {
		// Authenticate with DockerHub
		await this.authenticate(creds)

		// Get all orgs that user belongs to
		const orgs = await this.getOrgs()

		// Get all repos for user and orgs
		return (
			await Promise.all([
				(
					this.getRepos(creds.username, true)
						.catch(e => {
							console.warn(e)
							return undefined
						})
				),
				...orgs.map((org) => (
					this.getRepos(org, true)
						.catch(e => {
							console.warn(e)
							return undefined
						})
				)), 
			])
		)
			.flat()
			.filter(isTruthy)
	}

	/**
	 * Retrieves all public ritualnetwork repos.
	 *
	 * @returns Flat array of tagged repo ids.
	 */
	public async getRitualImages(): Promise<string[]> {
		try {
			return await this.getRepos('ritualnetwork')
		} catch (e) {
			console.warn(e)
			return []
		}
	}

	/**
	 * Search for public image names from Docker Hub.
	 */
	public async searchImages(query: string) {
		return (
			await fetch(
				`https://hub.docker.com/api/search/v3/catalog/search?${new URLSearchParams({
					query,
					source: 'community',
					type: 'image',
					from: '0',
					size: '20',
				})}`
			)
				.then(response => response.json())
		) as {
			total: number
			results: {
				id: string
				name: string
				slug: string
				publisher: {
					id: string
					name: string
				}
			}[]
		}
	}
}
