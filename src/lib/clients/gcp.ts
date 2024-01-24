import { google, compute_v1 } from 'googleapis';
import { BaseClient } from '$lib/clients/base';
import type { JWTInput, OAuth2Client } from 'google-auth-library';
import type { Machine } from '$lib/types';

// Google Cloud Provider extension of BaseClient abstract class.
export class GCPClient extends BaseClient {
	googleCompute!: compute_v1.Compute;
	projectId: string = '';

	async auth(creds: JWTInput) {
		try {
			const authObj = new google.auth.GoogleAuth({
				credentials: creds,
				scopes: ['https://www.googleapis.com/auth/cloud-platform']
			});
			const authClient = (await authObj.getClient()) as OAuth2Client;
			this.projectId = await authObj.getProjectId();
			this.googleCompute = google.compute({ version: 'v1', auth: authClient });
		} catch (error) {
			throw new Error(`Error during GCP authentication: ${(error as Error).message}`);
		}
	}

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
