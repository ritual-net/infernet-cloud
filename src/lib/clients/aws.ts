import * as AWS_SDK from 'aws-sdk';
import { BaseClient } from '$lib/clients/base';
import type { Machine } from '$types/clients';

// Amazon Web Services extension of BaseClient abstract class.
export class AWSClient extends BaseClient {
	amazonCompute: AWS_SDK.EC2;

	async auth(creds: AWS_SDK.Credentials) {
		try {
			AWS_SDK.config.update(creds);
			this.amazonCompute = new AWS_SDK.EC2({
				region: 'us-east-1' // initial region does not matter
			});
		} catch (error) {
			throw new Error(`Error during AWS authentication: ${error.message}`);
		}
	}

	async getRegions(): Promise<string[]> {
		const response = await this.amazonCompute.describeRegions().promise();
		return response.Regions.map((region: AWS_SDK.EC2.Region) => region.RegionName);
	}

	async getZones(region: string): Promise<string[]> {
		this.amazonCompute = new AWS_SDK.EC2({ region: region });
		const response = await this.amazonCompute.describeAvailabilityZones().promise();
		return response.AvailabilityZones.map((zone: AWS_SDK.EC2.AvailabilityZone) => zone.ZoneName);
	}

	async getMachines(region: string): Promise<Machine[]> {
		this.amazonCompute = new AWS_SDK.EC2({ region: region });
		const response = await this.amazonCompute.describeInstanceTypeOfferings().promise();
		return response.InstanceTypeOfferings.map(
			(offering: AWS_SDK.EC2.InstanceTypeOffering) =>
				({
					id: offering.InstanceType,
					name: offering.InstanceType,
					description: offering.InstanceType,
					link: 'https://aws.amazon.com/ec2/instance-types/'
				}) as Machine
		);
	}
}
