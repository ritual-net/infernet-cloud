import {
	DescribeInstancesCommand,
	EC2Client,
	RebootInstancesCommand,
	StartInstancesCommand,
	StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import { ProviderTypeEnum } from '$/types/provider';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { EC2ClientConfig } from '@aws-sdk/client-ec2';
import { BaseNodeClient } from '$/lib/clients/node/base';
import type { NodeInfo } from '$/types/provider';

export class AWSNodeClient extends BaseNodeClient {
	client: EC2Client;

	constructor(credentials: AWSServiceAccount['creds'], region: string) {
		super()

		const config: EC2ClientConfig = {
			region: region,
			credentials: {
				accessKeyId: credentials.access_key_id,
				secretAccessKey: credentials.secret_access_key,
			},
		};
		this.client = new EC2Client(config);
	}

	/**
	 * Get the type of provider this client is for.
	 *
	 * @returns provider type (aws)
	 */
	type(): ProviderTypeEnum {
		return ProviderTypeEnum.AWS;
	}

	/**
	 * Start set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to start
	 */
	async startNodes(ids: string[]): Promise<void> {
		const command = new StartInstancesCommand({ InstanceIds: ids });
		await this.client.send(command);
	}

	/**
	 * Stop set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to stop
	 */
	async stopNodes(ids: string[]): Promise<void> {
		const command = new StopInstancesCommand({ InstanceIds: ids });
		await this.client.send(command);
	}

	/**
	 * Restart set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to restart
	 */
	async restartNodes(ids: string[]): Promise<void> {
		const command = new RebootInstancesCommand({ InstanceIds: ids });
		await this.client.send(command);
	}

	/**
	 * Get status and ip of set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to get status and ip of
	 * @returns Flat array of node info objects
	 */
	async getNodesInfo(ids: string[]): Promise<NodeInfo[]> {
		const command = new DescribeInstancesCommand({ InstanceIds: ids });

		const result = await this.client.send(command);

		return (
			result.Reservations
				?.flatMap(reservation => (
					reservation
						.Instances
						?.map(instance => ({
							id: instance.InstanceId!,
							status: instance.State?.Name,
							ip: instance.PublicIpAddress,
						}))
					?? []
				))
			?? []
		);
	}
}
