import {
	EC2Client,
	DescribeRegionsCommand,
	DescribeAvailabilityZonesCommand,
	DescribeInstanceTypeOfferingsCommand,
} from '@aws-sdk/client-ec2';
import { BaseResourceClient } from '$/lib/clients/resource/base';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { EC2ClientConfig } from '@aws-sdk/client-ec2';
import type { Machine } from '$/types/provider';

// Amazon Web Services extension of BaseResourceClient abstract class.
export class AWSResourceClient extends BaseResourceClient {
	amazonCompute!: EC2Client;
	creds!: AWSServiceAccount['creds'];

	/**
	 * Helper method to create an EC2 instance from region.
	 *
	 * @param region - AWS region name
	 * @returns EC2 instance
	 */
	async createInstance(region: string): Promise<EC2Client> {
		const config: EC2ClientConfig = {
			region: region,
			credentials: {
				accessKeyId: this.creds.access_key_id,
				secretAccessKey: this.creds.secret_access_key,
			},
		};
		return new EC2Client(config);
	}

	/**
	 * AWS auth function
	 *
	 * @param creds - service account credentials from database
	 */
	async auth(creds: AWSServiceAccount['creds']) {
		try {
			// initial region does not matter
			this.creds = creds;
			this.amazonCompute = await this.createInstance('us-east-1');
			// sanity check to enusure creds are valid
			await this.getRegions();
		} catch (error) {
			throw new Error(`Error during AWS authentication: ${(error as Error).message}`);
		}
	}

	/**
	 * Returns a list of all available region names.
	 *
	 * @returns A flat array of region names.
	 * Example return value: ['us-east-1', 'us-west-2', 'eu-west-1']
	 */
	async getRegions(): Promise<string[]> {
		const command = new DescribeRegionsCommand({});
		const response = await this.amazonCompute.send(command);
		return (response.Regions?.map((region) => region.RegionName) ?? []).filter(
			(name): name is string => !!name
		);
	}

	/**
	 * Returns a list of all zone names in a given region.
	 *
	 * @param region - AWS region name
	 * @returns A flat array of zone names.
	 * Example return value: ['us-east-1a', 'us-east-1b', 'us-east-1c']
	 */
	async getZones(region: string): Promise<string[]> {
		this.amazonCompute = await this.createInstance(region);
		const command = new DescribeAvailabilityZonesCommand({});
		const response = await this.amazonCompute.send(command);
		return (response.AvailabilityZones?.map((zone) => zone.ZoneName) ?? []).filter(
			(name): name is string => !!name
		);
	}

	/**
	 * Returns a list of all machine types in a given region.
	 *
	 * @param region - AWS region name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "m2.4xlarge",
	 *     "name": "m2.4xlarge",
	 *     "description": "m2.4xlarge",
	 *     "link": "https://aws.amazon.com/ec2/instance-types/"
	 *   }, ...]
	 */
	async getMachines(region: string): Promise<Machine[]> {
		this.amazonCompute = await this.createInstance(region);
		const command = new DescribeInstanceTypeOfferingsCommand({});
		const response = await this.amazonCompute.send(command);
		return (
			response.InstanceTypeOfferings?.map((offering) => ({
				id: offering.InstanceType!,
				name: offering.InstanceType!,
				description: offering.InstanceType!,
				link: 'https://aws.amazon.com/ec2/instance-types/',
			})) ?? []
		);
	}
}