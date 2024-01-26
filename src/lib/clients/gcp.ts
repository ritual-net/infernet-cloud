import { google, compute_v1 } from 'googleapis';
import { BaseClient } from '$lib/clients/base';
import type { OAuth2Client } from 'google-auth-library';
import type { Machine } from '$types/provider';
import type { GCPServiceAccount } from '$schema/interfaces';

// Google Cloud Provider extension of BaseClient abstract class.
export class GCPClient extends BaseClient {
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
					private_key: creds.private_key!.split(String.raw`\n`).join('\n'),
					project_id: creds.project_id
				},
				scopes: ['https://www.googleapis.com/auth/cloud-platform']
			});
			const authClient = (await authObj.getClient()) as OAuth2Client;
			this.projectId = creds.project_id!;
			this.googleCompute = google.compute({ version: 'v1', auth: authClient });
		} catch (error) {
			throw new Error(`Error during GCP authentication: ${(error as Error).message}`);
		}
	}

	/**
	 * Returns a list of all available region names.
	 *
	 * @returns A flat array of region names.
	 * Example return value: ['us-east1', 'us-west1', 'us-central1']
	 */
	async getRegions(): Promise<string[]> {
		const response = await this.googleCompute.regions.list({
			project: this.projectId
		});
		return (
			response.data.items
				?.map((region: compute_v1.Schema$Region) => region.name)
				.filter(
					(regionName): regionName is string => regionName !== null && regionName !== undefined
				) ?? []
		);
	}

	/**
	 * Returns a list of all zone names in a given region.
	 *
	 * @param region - GCP region name
	 * @returns A flat array of zone names.
	 * Example return value: ['us-east1-a', 'us-east1-b', 'us-east1-c']
	 */
	async getZones(region: string): Promise<string[]> {
		const response = await this.googleCompute.zones.list({
			project: this.projectId
		});
		return (
			response.data.items
				?.filter(
					(zone: compute_v1.Schema$Zone) =>
						zone.region && zone.region.endsWith(`/regions/${region}`)
				)
				.map((zone: compute_v1.Schema$Zone) => zone.name)
				.filter((zoneName): zoneName is string => zoneName !== null && zoneName !== undefined) ?? []
		);
	}

	/**
	 * Returns a list of all machine types in a given region.
	 *
	 * @param region - GCP region name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "1210042",
	 *     "name": "t2d-standard-48",
	 *     "description": "48 vCPUs, 192 GB RAM",
	 *     "link": "https://www.googleapis.com/compute/v1/projects/project/zones/us-west4-c/machineTypes/t2d-standard-48"
	 *   }, ...]
	 */
	async getMachines(region: string): Promise<Machine[]> {
		const zones = await this.getZones(region);
		const machines = await Promise.all(
			zones.flatMap(async (zone) => {
				const response = await this.googleCompute.machineTypes.list({
					project: this.projectId,
					zone: zone
				});
				return (
					response.data.items?.map(
						(machine: compute_v1.Schema$MachineType) =>
							({
								id: machine.id,
								name: machine.name,
								description: machine.description,
								link: machine.selfLink
							}) as Machine
					) ?? []
				);
			})
		);
		return machines.flat();
	}
}
