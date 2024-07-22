import {
	EC2Client,
	DescribeRegionsCommand,
	DescribeAvailabilityZonesCommand,
	DescribeInstanceTypeOfferingsCommand,
	DescribeInstanceTypesCommand,
} from '@aws-sdk/client-ec2';
import { BaseResourceClient } from '$/lib/clients/resource/base';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { EC2ClientConfig, _InstanceType } from '@aws-sdk/client-ec2';
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
	async createInstance(region: string) {
		return new EC2Client({
			region: region,
			credentials: {
				accessKeyId: this.creds.access_key_id,
				secretAccessKey: this.creds.secret_access_key,
			},
		})
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
			await this.getRegionIds();
		} catch (error) {
			throw new Error(`Error during AWS authentication: ${(error as Error).message}`);
		}
	}

	/**
	 * Returns a list of all available region IDs.
	 *
	 * @returns A flat array of region IDs.
	 * Example return value: ['us-east-1', 'us-west-2', 'eu-west-1']
	 */
	async getRegionIds(): Promise<string[]> {
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
	 * Returns a list of all machine types in a given zone.
	 *
	 * @param zone - AWS zone name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "m2.4xlarge",
	 *     "name": "m2.4xlarge",
	 *     "description": "m2.4xlarge",
	 *     "link": "https://aws.amazon.com/ec2/instance-types/"
	 *   }, ...]
	 */
	async getMachines(zone: string): Promise<Machine[]> {
		const region = zone.slice(0, -1)

		this.amazonCompute = await this.createInstance(region)
	
		const response = await this.amazonCompute.send(
			new DescribeInstanceTypeOfferingsCommand({
				LocationType: 'availability-zone',
				Filters: [
					{
						Name: 'location',
						Values: [zone],
					},
				],
			})
		)

		return (
			response.InstanceTypeOfferings?.map((offering) => ({
				id: offering.InstanceType!,
				name: offering.InstanceType!,
				description: offering.InstanceType!,
				link: 'https://aws.amazon.com/ec2/instance-types/',
			})) ?? []
		);
	}

	async getMachineInfo(instanceType: _InstanceType) {
		const detailsResponse = await this.amazonCompute.send(
			new DescribeInstanceTypesCommand({
				InstanceTypes: [instanceType],
			})
		)

		const instanceTypeInfo = detailsResponse.InstanceTypes?.[0]

		return {
			id: instanceType,
			name: instanceType,
			description: '',
			link: 'https://aws.amazon.com/ec2/instance-types/',
			hasGpu: instanceTypeInfo?.GpuInfo ? true : false,
			info: instanceTypeInfo,
		} as Machine
	}
}
