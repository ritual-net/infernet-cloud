import AWS_SDK from 'aws-sdk';
import { BaseResourceClient } from '$/lib/clients/resource/base';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { Machine } from '$/types/provider';

// Amazon Web Services extension of BaseResourceClient abstract class.
export class AWSResourceClient extends BaseResourceClient {
	amazonCompute!: AWS_SDK.EC2;
	creds!: AWSServiceAccount['creds'];

	/**
	 * Helper method to create an EC2 instance from region.
	 *
	 * @param region - AWS region name
	 * @returns EC2 instance
	 */
	async createInstance(region: string): Promise<AWS_SDK.EC2> {
		return new AWS_SDK.EC2({
			accessKeyId: this.creds.access_key_id,
			secretAccessKey: this.creds.secret_access_key,
			region: region,
		});
	}

	/**
	 * AWS auth function
	 *
	 * @param creds - service account credentials from database
	 */
	async auth(creds: AWSServiceAccount['creds']) {
		try {
			// sanity check to ensure db creds work, initial region does not matter
			this.creds = creds;
			this.amazonCompute = await this.createInstance('us-east-1');
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
		const response = await this.amazonCompute.describeRegions().promise();
		return (
			response.Regions?.map((region: AWS_SDK.EC2.Region) => region.RegionName).filter(
				(name): name is string => name !== undefined
			) ?? []
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
		const response = await this.amazonCompute.describeAvailabilityZones().promise();
		return (
			response.AvailabilityZones?.map((zone: AWS_SDK.EC2.AvailabilityZone) => zone.ZoneName).filter(
				(name): name is string => name !== undefined
			) ?? []
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
		const response = await this.amazonCompute.describeInstanceTypeOfferings().promise();
		return (
			response.InstanceTypeOfferings?.map(
				(offering: AWS_SDK.EC2.InstanceTypeOffering) =>
					({
						id: offering.InstanceType,
						name: offering.InstanceType,
						description: offering.InstanceType,
						link: 'https://aws.amazon.com/ec2/instance-types/',
					}) as Machine
			) ?? []
		);
	}
}