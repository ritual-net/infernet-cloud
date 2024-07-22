// Types
import type { GCPServiceAccount } from '$schema/interfaces'
import type { Machine } from '$/types/provider'
import type { OAuth2Client } from 'google-auth-library'


// Functions
import { compute_v1, google } from 'googleapis'
import { BaseResourceClient } from '$/lib/clients/resource/base'
import { isTruthy } from '$/lib/utils/isTruthy'


/**
 * Google Cloud Provider extension of BaseResourceClient abstract class.
 */
export class GCPResourceClient extends BaseResourceClient {
	googleCompute!: compute_v1.Compute;
	projectId: string = '';

	/**
	 * GCP auth function
	 *
	 * @param creds - service account credentials from database
	 */
	async auth(creds: GCPServiceAccount['creds']) {
		try {
			const authObj = new google.auth.GoogleAuth({
				credentials: {
					client_email: creds.client_email,
					private_key: creds.private_key.split(String.raw`\n`).join('\n'),
					project_id: creds.project_id,
				},
				scopes: ['https://www.googleapis.com/auth/cloud-platform'],
			})

			const authClient = (await authObj.getClient()) as OAuth2Client

			this.projectId = creds.project_id
			this.googleCompute = google.compute({ version: 'v1', auth: authClient })

			// sanity check for creds
			await this.getRegionIds()
		} catch (error) {
			throw new Error(`Error during GCP authentication: ${(error as Error).message}`)
		}
	}

	/**
	 * Returns a list of all available region IDs.
	 *
	 * @returns A flat array of region IDs.
	 * Example return value: ['us-east1', 'us-west1', 'us-central1']
	 */
	async getRegionIds() {
		const response = await this.googleCompute.regions.list({
			project: this.projectId,
		})

		return (
			response.data.items
				?.map(region => region.name)
				.filter(isTruthy)
			?? []
		)
	}

	/**
	 * Returns a list of all zone names in a given region.
	 *
	 * @param region - GCP region name
	 * @returns A flat array of zone names.
	 * Example return value: ['us-east1-a', 'us-east1-b', 'us-east1-c']
	 */
	async getZones(region: string) {
		const response = await this.googleCompute.zones.list({
			project: this.projectId,
		})

		return (
			response.data.items
				?.filter(zone => (
					zone.region && zone.region.endsWith(`/regions/${region}`)
				))
				.map(zone => zone.name)
				.filter(isTruthy)
			?? []
		)
	}

	/**
	 * Returns a list of all machine types in a given zone.
	 *
	 * @param zone - GCP zone name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "1210042",
	 *     "name": "t2d-standard-48",
	 *     "description": "48 vCPUs, 192 GB RAM",
	 *     "link": "https://www.googleapis.com/compute/v1/projects/project/zones/us-west4-c/machineTypes/t2d-standard-48"
	 *   }, ...]
	 */
	async getMachines(zone: string) {
		const response = await this.googleCompute.machineTypes.list({
			project: this.projectId,
			zone: zone,
		})

		return (
			response.data.items
				?.map(machine => ({
					id: machine.id,
					name: machine.name,
					description: machine.description,
					link: machine.selfLink,
				}) as Machine)
			?? []
		)
	}
}
