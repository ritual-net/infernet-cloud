// Types
import type { AWSServiceAccount } from '$schema/interfaces'
import type { _InstanceType } from '@aws-sdk/client-ec2'
import { ProviderTypeEnum, type Machine, type MachineImage } from '$/types/provider'
import { getRegionName } from '$/lib/utils/providers/common'


// Functions
import {
	EC2Client,
	DescribeRegionsCommand,
	DescribeAvailabilityZonesCommand,
	DescribeInstanceTypeOfferingsCommand,
	DescribeInstanceTypesCommand,
	DescribeImagesCommand,
} from '@aws-sdk/client-ec2'
import { BaseResourceClient } from '$/lib/clients/resource/base'

import { isTruthy } from '$/lib/utils/isTruthy'

/**
 * Amazon Web Services extension of BaseResourceClient abstract class.
 */
export class AWSResourceClient extends BaseResourceClient<ProviderTypeEnum.AWS> {
	amazonCompute!: EC2Client
	creds!: AWSServiceAccount['creds']

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
			this.creds = creds
			this.amazonCompute = await this.createInstance('us-east-1')
			// sanity check to enusure creds are valid
			await this.getRegions()
		} catch (error) {
			throw new Error(`Error during AWS authentication: ${(error as Error).message}`)
		}
	}

	/**
	 * Returns a list of all available region IDs.
	 *
	 * @returns A flat array of region IDs.
	 * Example return value: ['us-east-1', 'us-west-2', 'eu-west-1']
	 */
	async getRegions() {
		const command = new DescribeRegionsCommand({})
		const response = await this.amazonCompute.send(command)

		return (
			response
				.Regions
				?.map(region => {
					const id = region.RegionName!
					const name = getRegionName(id, ProviderTypeEnum.AWS)
					const continent = name.match(/^(.+) \(.+\)/)?.[1]

					return {
						id,
						name,
						continent,
						info: region,
					}
				})
				.filter(isTruthy)
				// Restrict to `us-east-1` to avoid "Resource not found" errors
				.filter(region => region.id === 'us-east-1')
			?? []
		)
	}

	/**
	 * Returns a list of all zone names in a given region.
	 *
	 * @param regionId - AWS region name
	 * @returns A flat array of zone names.
	 * Example return value: ['us-east-1a', 'us-east-1b', 'us-east-1c']
	 */
	async getZones(
		regionId: string,
	) {
		this.amazonCompute = await this.createInstance(regionId)

		const command = new DescribeAvailabilityZonesCommand({})

		const response = await this.amazonCompute.send(command)

		return (
			response
				.AvailabilityZones
				?.map(zone => ({
					id: zone.ZoneName!,
					name: zone.ZoneName!,
					info: zone,
				}))
				.filter(isTruthy)
			?? []
		)
	}

	/**
	 * Returns a list of all machine types in a given zone.
	 *
	 * @param zoneId - AWS zone name
	 * @returns A flat array of machine types.
	 * Example return value: [
	 *   {
	 *     "id": "m2.4xlarge",
	 *     "name": "m2.4xlarge",
	 *     "description": "m2.4xlarge",
	 *     "link": "https://aws.amazon.com/ec2/instance-types/"
	 *   }, ...]
	 */
	async getMachines(zoneId: string): Promise<Machine[]> {
		const regionId = zoneId.slice(0, -1)

		this.amazonCompute = await this.createInstance(regionId)

		const response = await this.amazonCompute.send(
			new DescribeInstanceTypeOfferingsCommand({
				LocationType: 'availability-zone',
				Filters: [
					{
						Name: 'location',
						Values: [zoneId],
					},
				],
			}),
		)

		return (
			response.InstanceTypeOfferings
				?.map(offering => ({
					id: offering.InstanceType!,
					name: offering.InstanceType!,
				}))
			?? []
		)
	}

	async getMachineInfo(
		machineId: _InstanceType,
		zoneId: string,
	) {
		const detailsResponse = await this.amazonCompute.send(
			new DescribeInstanceTypesCommand({
				InstanceTypes: [machineId],
			}),
		)

		const instanceTypeInfo = detailsResponse.InstanceTypes?.[0]

		return {
			id: machineId,
			name: machineId,
			hasGpu: instanceTypeInfo?.GpuInfo ? true : false,
			info: instanceTypeInfo,
		}
	}

	async getMachineImages(
		machineId: _InstanceType,
		zoneId: string,
	): Promise<MachineImage[]> {
		const architectures = (await this.getMachineInfo(machineId, zoneId)).info?.ProcessorInfo?.SupportedArchitectures

		const response = await this.amazonCompute.send(
			new DescribeImagesCommand({
				Filters: (
					[
						{
							Name: 'state',
							Values: ['available'],
						},
						architectures && {
							Name: 'architecture',
							Values: architectures,
						},
						{
							Name: 'name',
							Values: ['ubuntu/images/hvm-ssd/ubuntu-*'],
						},
					]
						.filter(isTruthy)
				),
				Owners: ['amazon'],
			})
		)

		return (
			response.Images
				?.map(image => ({
					id: image.ImageId!,
					name: image.Name || image.ImageId!,
					description: image.Description || '',
				}))
				.sort((a, b) => a.name.localeCompare(b.name))
			?? []
		)
	}

	async getMachineImageInfo(
		imageId: string,
	) {
		const response = await this.amazonCompute.send(
			new DescribeImagesCommand({
				ImageIds: [imageId],
			}),
		)

		const image = response.Images?.[0]
		if (!image)
			throw new Error(`Image with ID ${imageId} not found`)

		return {
			id: image.ImageId!,
			name: image.Name || image.ImageId!,
			description: image.Description || '',
			info: image,
		}
	}
}
