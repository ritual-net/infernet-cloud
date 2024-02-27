import {
	DescribeInstancesCommand,
	EC2Client,
	StartInstancesCommand,
	StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import { ProviderTypeEnum } from '$/types/provider';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { EC2ClientConfig } from '@aws-sdk/client-ec2';
import type { BaseNodeClient } from '$/lib/clients/node/base';
import type { NodeInfo } from '$/types/provider';

export class AWSNodeClient implements BaseNodeClient {
	client: EC2Client;

	constructor(credentials: AWSServiceAccount['creds'], region: string) {
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
	 * Get status and ip of set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to get status and ip of
	 * @returns Flat array of node info objects
	 */
	async getNodesInfo(ids: string[]): Promise<NodeInfo[]> {
		const command = new DescribeInstancesCommand({ InstanceIds: ids });
		const result = await this.client.send(command);
		const nodesInfo: NodeInfo[] = [];
		result.Reservations?.forEach((reservation) => {
			reservation.Instances?.forEach((instance) => {
				nodesInfo.push({
					id: instance.InstanceId!,
					status: instance.State?.Name,
					ip: instance.PublicIpAddress,
					node: undefined,
				});
			});
		});
		return nodesInfo;
	}
}