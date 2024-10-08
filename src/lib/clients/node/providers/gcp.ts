import { InstancesClient } from '@google-cloud/compute'
import { ProviderTypeEnum } from '$/types/provider'
import { BaseNodeClient } from '$/lib/clients/node/base'
import type { GCPServiceAccount } from '$schema/interfaces'

export class GCPNodeClient extends BaseNodeClient {
	public projectId: string

	#client: InstancesClient | undefined

	constructor(
		private credentials: GCPServiceAccount['creds'],
		public zone: string,
		public instanceId: string,
	) {
		super()

		this.projectId = this.credentials.project_id
	}

	get client(): InstancesClient {
		return (this.#client ??= new InstancesClient({
			projectId: this.credentials.project_id,
			credentials: {
				client_email: this.credentials.client_email,
				private_key: this.credentials.private_key.split(String.raw`\n`).join('\n'),
			},
		}))
	}

	get type() {
		return ProviderTypeEnum.GCP
	}

	async start() {
		return await this.client.start({
			project: this.projectId,
			zone: this.zone,
			instance: this.instanceId,
		})
	}

	async stop() {
		return await this.client.stop({
			project: this.projectId,
			zone: this.zone,
			instance: this.instanceId,
		})
	}

	async restart() {
		return await this.client.reset({
			project: this.projectId,
			zone: this.zone,
			instance: this.instanceId,
		})
	}

	async getInfo() {
		const result = await this.client.get({
			project: this.projectId,
			zone: this.zone,
			instance: this.instanceId,
		})

		return {
			instanceId: this.instanceId,
			status: result[0]?.status?.toLowerCase() ?? undefined,
			ip: result[0]?.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP ?? undefined,
			instanceInfo: (
				Object.fromEntries(
					Object.entries(result[0] ?? {})
						.filter(([key, value]) => (
							!key.startsWith('_')
						))
						.map(([key, value]) => ([
							key,
							typeof value === 'object' ?
								Object.fromEntries(
									Object.entries(value ?? {})
										.filter(([key, value]) => (
											!key.startsWith('_')
										))
								)
							:
								value
						]))
				)
			),
		}
	}

	async getLogs(start?: number) {
		const result = await this.client.getSerialPortOutput(
			{
				project: this.projectId,
				zone: this.zone,
				instance: this.instanceId,
				port: 1,
				start,
			},
			{
				autoPaginate: true,
			},
		)

		const { contents, ...output } = result[0]

		return {
			start: typeof output.start === 'number' ? output.start : output.next ? Number(output.next) : undefined,
			next: typeof output.next === 'number' ? output.next : output.next ? Number(output.next) : undefined,
			logs: (
				contents
					?.trim()
					?.split('\r\n')
					.slice(1)
					.map(log => {
						const match = (
							log
								.trim()
								.match(/^(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}(?:\+\d{2}:\d{2})?)\s+(?<hostname>\S+)\s+(?<process>\S+)(?:\[(?<pid>\d+)\])?:\s+(?<message>.*)$/)
						)

						if (!match?.groups)
							return {
								text: log,
							}

						const { timestamp, process, pid, message } = match.groups

						console.log({timestamp}, new Date(timestamp).getTime())

						return {
							timestamp: new Date(timestamp).getTime(),
							source: `${process}${pid ? `[${pid}]` : ''}`,
							text: message,
						}
					})
				?? []
			),
		}
	}
}
