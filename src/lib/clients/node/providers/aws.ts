import {
	DescribeInstancesCommand,
	EC2Client,
	GetConsoleOutputCommand,
	RebootInstancesCommand,
	StartInstancesCommand,
	StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { ProviderTypeEnum } from '$/types/provider'
import type { AWSServiceAccount } from '$schema/interfaces'
import { BaseNodeClient } from '$/lib/clients/node/base'
import { removeAnsiEscapeCodes } from '$/lib/utils/system'

export class AWSNodeClient extends BaseNodeClient {
	#client: EC2Client | undefined

	constructor(
		private credentials: AWSServiceAccount['creds'],
		public region: string,
		public instanceId: string,
	) {
		super()
	}

	get client() {
		return (this.#client ??= new EC2Client({
			region: this.region,
			credentials: {
				accessKeyId: this.credentials.access_key_id,
				secretAccessKey: this.credentials.secret_access_key,
			},
		}))
	}

	get type() {
		return ProviderTypeEnum.AWS
	}

	async start() {
		return await this.client.send(
			new StartInstancesCommand({
				InstanceIds: [this.instanceId],
			}),
		)
	}

	async stop() {
		return await this.client.send(
			new StopInstancesCommand({
				InstanceIds: [this.instanceId],
			}),
		)
	}

	async restart() {
		return await this.client.send(
			new RebootInstancesCommand({
				InstanceIds: [this.instanceId],
			}),
		)
	}

	async getInfo() {
		const result = await this.client.send(
			new DescribeInstancesCommand({
				InstanceIds: [this.instanceId],
			}),
		)

		const instance = result.Reservations?.[0]?.Instances?.[0]

		if (!instance)
			throw new Error(`Instance ${this.instanceId} not found.`)

		return {
			instanceId: instance.InstanceId!,
			status: instance.State?.Name?.toLowerCase(),
			ip: instance.PublicIpAddress,
			instanceInfo: instance,
		}
	}

	async getLogs() {
		const result = await this.client.send(
			new GetConsoleOutputCommand({
				InstanceId: this.instanceId,
			}),
		)

		const output = (
			result.Output
				? Buffer.from(result.Output, 'base64')
					.toString('utf-8')
				: undefined
		)

		return {
			logs: (
				removeAnsiEscapeCodes(output)
					?.split('\n')
					.map(line => ({
						text: line,
						timestamp: result.Timestamp!,
					})) ?? []
			),
		}
	}
}
