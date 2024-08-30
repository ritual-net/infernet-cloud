import { InstancesClient } from '@google-cloud/compute'
import { ProviderTypeEnum } from '$/types/provider'
import { BaseNodeClient } from '$/lib/clients/node/base'
import type { GCPServiceAccount } from '$schema/interfaces'

export class GCPNodeClient extends BaseNodeClient {
	public projectId: string

	#client: InstancesClient | undefined;

	constructor(
		private credentials: GCPServiceAccount['creds'],
		public zone: string,
		public nodeConfigId: string,
	) {
		super()

		this.projectId = this.credentials.project_id
	}

	get client(): InstancesClient {
		return this.#client ??= new InstancesClient({
			projectId: this.credentials.project_id,
			credentials: {
				client_email: this.credentials.client_email,
				private_key: this.credentials.private_key.split(String.raw`\n`).join('\n'),
			},
		})
	}

	get type() {
		return ProviderTypeEnum.GCP
	}

	get instanceId() {
		return `node-${this.nodeConfigId}`
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
			status: result[0]?.status ?? undefined,
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
}
