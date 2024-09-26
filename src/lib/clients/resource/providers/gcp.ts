// Types/constants
import type { GCPServiceAccount } from '$schema/interfaces'
import { ProviderTypeEnum, type Machine } from '$/types/provider'
import type { OAuth2Client } from 'google-auth-library'


// Functions
import { compute_v1, google } from 'googleapis'
import { BaseResourceClient } from '$/lib/clients/resource/base'

import { isTruthy } from '$/lib/utils/isTruthy'
import { getRegionName } from '$/lib/utils/providers/common'


/**
 * Google Cloud Provider extension of BaseResourceClient abstract class.
 */
export class GCPResourceClient extends BaseResourceClient<ProviderTypeEnum.GCP> {
	googleCompute!: compute_v1.Compute
	projectId: string = ''

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
			await this.getRegions()
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
	async getRegions() {
		const response = await this.googleCompute.regions.list({
			project: this.projectId,
		})

		return (
			response.data.items
				?.map(region => {
					const id = region.name!
					const name = getRegionName(id, ProviderTypeEnum.GCP)
					const continent = name.match(/, ([^,]+?)$/)?.[1]

					return {
						id,
						name,
						continent,
						info: region,
					}
				})
				.filter(isTruthy)
			?? []
		)
	}

	/**
	 * Returns a list of all zone names in a given region.
	 *
	 * @param regionId - GCP region name
	 * @returns A flat array of zone names.
	 * Example return value: ['us-east1-a', 'us-east1-b', 'us-east1-c']
	 */
	async getZones(regionId: string) {
		const response = await this.googleCompute.zones.list({
			project: this.projectId,
		})

		return (
			response.data.items
				?.filter(zone => (
					zone.region && zone.region.endsWith(`/regions/${regionId}`)
				))
				.map(zone => ({
					id: zone.name!,
					name: zone.name!,
					info: zone,
				}))
				.filter(isTruthy)
			?? []
		)
	}

	/**
	 * Returns a list of all machine types in a given zone.
	 *
	 * @param zoneId - GCP zone name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "1210042",
	 *     "name": "t2d-standard-48",
	 *     "description": "48 vCPUs, 192 GB RAM",
	 *     "link": "https://www.googleapis.com/compute/v1/projects/project/zones/us-west4-c/machineTypes/t2d-standard-48"
	 *   }, ...]
	 */
	async getMachines(
		zoneId: string,
	) {
		const response = await this.googleCompute.machineTypes.list({
			project: this.projectId,
			zone: zoneId,
		})

		return (
			response.data.items
				?.map(machine => ({
					id: machine.name!,
					name: machine.name!,
					description: machine.description ?? undefined,
					// https://cloud.google.com/compute/docs/gpus/#gpus_for_compute_workloads
					hasGpu: /^(a3|a2|g2|n1)-/.test(machine.name!),
				}))
			?? []
		)
	}

	async getMachineInfo(
		machineId: string,
		zoneId: string,
	) {
		const response = await this.googleCompute.machineTypes.get({
			project: this.projectId,
			machineType: machineId,
			zone: zoneId,
		})

		const machine = response.data

		return {
			id: machineId,
			name: machine.name!,
			description: machine.description ?? undefined,
			link: machine.selfLink,
			// https://cloud.google.com/compute/docs/gpus/#gpus_for_compute_workloads
			hasGpu: /^(a3|a2|g2|n1)-/.test(machine.name!),
			info: machine,
		}
	}

	async getMachineImages(
		machineId: string,
		zoneId: string,
	) {
		const response = await this.googleCompute.images.list({
			project: 'ubuntu-os-cloud',
			// filter: `status = READY AND family:ubuntu* AND deprecated.state != "OBSOLETE"`,
			maxResults: 1000,
			orderBy: 'creationTimestamp desc',
		})

		return (
			response.data.items
				?.filter(image =>(
					image.deprecated?.state !== 'OBSOLETE'
				))
				.map(image => ({
					id: image.name!,
					name: image.name!,
					description: image.description || '',
				}))
				// .sort((a, b) => a.name.localeCompare(b.name))
			?? []
		)
	}

	async getMachineImageInfo(
		imageId: string,
	) {
		const response = await this.googleCompute.images.get({
			project: 'ubuntu-os-cloud',
			image: imageId,
		})

		return {
			id: imageId,
			name: response.data.name!,
			description: response.data.description || '',
			info: response.data,
		}
	}
}
