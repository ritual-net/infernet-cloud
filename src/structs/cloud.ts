import { google } from 'googleapis';
import * as AWS_SDK from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export type Machine = {
	id: string;
	name: string;
	description: string;
	link: string;
};

/**
 * Interface for cloud providers.
 */
export interface CloudProvider {
	/**
	 * Authenticate with the cloud provider.
	 * This method should be called before any other methods.
	 * @returns A promise that resolves when authentication is complete.
	 */
	auth(): Promise<void>;

	/**
	 * Get the list of regions available on the cloud provider.
	 * @returns Flat array of all regions.
	 */
	getRegions(): Promise<string[]>;

	/**
	 * Get the list of zones in a region.
	 * @param region The name of the region.
	 * @returns Flat array of all zones in the region.
	 */
	getZones(region: string): Promise<string[]>;

	/**
	 * Get the list of machine types in a region.
	 * @param region The name of the region.
	 * @returns Flat array of all machine types in the region.
	 */
	getMachines(region: string): Promise<Machine[]>;
}

// Google Cloud Provider implementation of CloudProvider interface.
export class GCP implements CloudProvider {
	googleCompute: any;
	projectId: string = '';
	authPromise: Promise<void>;

	constructor() {
		this.authPromise = this.auth();
	}

	async auth() {
		if (!process.env.GCLOUD_CREDENTIALS_FILE) {
			throw new Error('The GCLOUD_CREDENTIALS_FILE environment variable is not set.');
		}

		try {
			const authObj = new google.auth.GoogleAuth({
				keyFilename: process.env.GCLOUD_CREDENTIALS_FILE,
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
		await this.authPromise;
		const response = await this.googleCompute.regions.list({
			project: this.projectId
		});
		return response.data.items.map((region: any) => region.name);
	}

	async getZones(region: string): Promise<string[]> {
		await this.authPromise;
		const response = await this.googleCompute.zones.list({
			project: this.projectId
		});
		return response.data.items
			.filter((zone: any) => zone.region.endsWith(`/regions/${region}`))
			.map((zone: any) => zone.name);
	}

	async getMachines(region: string): Promise<Machine[]> {
		await this.authPromise;
		const zones = await this.getZones(region);

		const machines: Machine[] = [];
		for (const zone of zones) {
			const response = await this.googleCompute.machineTypes.list({
				project: this.projectId,
				zone: zone
			});
			const zoneMachines = response.data.items.map(
				(machine: any) =>
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

// Amazon Web Services implementation of CloudProvider interface.
export class AWS implements CloudProvider {
	amazonCompute: any;
	authPromise: Promise<void>;

	constructor() {
		this.authPromise = this.auth();
	}

	async auth() {
		if (!process.env.AWS_CONFIG_FILE || !process.env.AWS_SDK_LOAD_CONFIG) {
			throw new Error(
				'The AWS_CONFIG_FILE and/or AWS_SDK_LOAD_CONFIG environment variables are not set.'
			);
		}

		try {
			this.amazonCompute = new AWS_SDK.EC2({
				region: 'us-east-1' // initial region does not matter
			});
		} catch (error) {
			throw new Error(`Error during AWS authentication: ${error.message}`);
		}
	}

	async getRegions(): Promise<string[]> {
		await this.authPromise;
		const response = await this.amazonCompute.describeRegions().promise();
		return response.Regions.map((region: any) => region.RegionName);
	}

	async getZones(region: string): Promise<string[]> {
		await this.authPromise;
		this.amazonCompute = new AWS_SDK.EC2({ region: region });
		const response = await this.amazonCompute.describeAvailabilityZones().promise();
		return response.AvailabilityZones.map((zone: any) => zone.ZoneName);
	}

	async getMachines(region: string): Promise<Machine[]> {
		await this.authPromise;
		this.amazonCompute = new AWS_SDK.EC2({ region: region });
		const response = await this.amazonCompute.describeInstanceTypeOfferings().promise();
		return response.InstanceTypeOfferings.map(
			(offering: any) =>
				({
					id: offering.InstanceType,
					name: offering.InstanceType,
					description: offering.InstanceType,
					link: 'https://aws.amazon.com/ec2/instance-types/'
				}) as Machine
		);
	}
}

export const PROVIDER_MAP: Record<string, CloudProvider> = {
	aws: new AWS(),
	gcp: new GCP()
};
