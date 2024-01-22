import { google, compute_v1 } from 'googleapis';
import { BaseClient } from '$lib/clients/base';
import type { JWTInput } from 'google-auth-library';
import type { Machine } from '$types/clients';

// Google Cloud Provider extension of BaseClient abstract class.
export class GCPClient extends BaseClient {
	googleCompute: compute_v1.Compute;
	projectId: string = '';

	async auth(creds: JWTInput) {
		try {
			const authObj = new google.auth.GoogleAuth({
				credentials: creds,
				scopes: ['https://www.googleapis.com/auth/cloud-platform']
			});
			const authClient = await authObj.getClient();
			this.projectId = await authObj.getProjectId();
			this.googleCompute = google.compute({ version: 'v1', auth: authClient });
		} catch (error) {
			throw new Error(`Error during GCP authentication: ${error.message}`);
		}
	}

	async getRegions(): Promise<string[]> {
		const response = await this.googleCompute.regions.list({
			project: this.projectId
		});
		return response.data.items.map((region: compute_v1.Schema$Region) => region.name);
	}

	async getZones(region: string): Promise<string[]> {
		const response = await this.googleCompute.zones.list({
			project: this.projectId
		});
		return response.data.items
			.filter((zone: compute_v1.Schema$Zone) => zone.region.endsWith(`/regions/${region}`))
			.map((zone: compute_v1.Schema$Zone) => zone.name);
	}

	async getMachines(region: string): Promise<Machine[]> {
		const zones = await this.getZones(region);

		const machines: Machine[] = [];
		for (const zone of zones) {
			const response = await this.googleCompute.machineTypes.list({
				project: this.projectId,
				zone: zone
			});
			const zoneMachines = response.data.items.map(
				(machine: compute_v1.Schema$MachineType) =>
					({
						id: machine.id,
						name: machine.name,
						description: machine.description,
						link: machine.selfLink
					}) as Machine
			);
			machines.push(...zoneMachines);
		}
		return machines;
	}
}