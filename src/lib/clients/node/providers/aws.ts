import {
	DescribeInstancesCommand,
	EC2Client,
	RebootInstancesCommand,
	StartInstancesCommand,
	StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { ProviderTypeEnum } from '$/types/provider'
import type { AWSServiceAccount } from '$schema/interfaces'
import { BaseNodeClient } from '$/lib/clients/node/base'

export class AWSNodeClient extends BaseNodeClient {
	#client: EC2Client | undefined

	constructor(
		private credentials: AWSServiceAccount['creds'],
		public region: string,
		public nodeConfigId: string,
	) {
		super()
	}

	get client() {
		return this.#client ??= new EC2Client({
			region: this.region,
			credentials: {
				accessKeyId: this.credentials.access_key_id,
				secretAccessKey: this.credentials.secret_access_key,
			},
		})
	}

	get type() {
		return ProviderTypeEnum.AWS
	}

	get instanceId() {
		return `node-${this.nodeConfigId}`
	}

	async start() {
		return await this.client.send(
			new StartInstancesCommand({
				InstanceIds: [this.instanceId],
			})
		)
	}

	async stop() {
		return await this.client.send(
			new StopInstancesCommand({
				InstanceIds: [this.instanceId],
			})
		)
	}

	async restart() {
		return await this.client.send(
			new RebootInstancesCommand({
				InstanceIds: [this.instanceId],
			})
		)
	}

	async getInfo() {
		const result = await this.client.send(
			new DescribeInstancesCommand({
				InstanceIds: [this.instanceId],
			})
		)

		const instance = result.Reservations?.[0]?.Instances?.[0]

		return {
			instanceId: instance?.InstanceId,
			status: instance?.State?.Name,
			ip: instance?.PublicIpAddress,
			instanceInfo: instance,
		}
	}
}
