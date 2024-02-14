import AWS from 'aws-sdk';
import { ProviderTypeEnum } from '$/types/provider';
import type { AWSServiceAccount } from '$schema/interfaces';
import type { BaseNodeClient } from '$/lib/clients/node/base';
import type { NodeInfo } from '$/types/provider';

export class AWSNodeClient implements BaseNodeClient {
	client: AWS.EC2;

	constructor(credentials: AWSServiceAccount['creds'], region: string) {
		this.client = new AWS.EC2({
			accessKeyId: credentials.access_key_id,
			secretAccessKey: credentials.secret_access_key,
			region: region,
		});
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
		const params: AWS.EC2.StartInstancesRequest = {
			InstanceIds: ids,
		};

		await this.client.startInstances(params).promise();
	}

	/**
	 * Stop set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to stop
	 */
	async stopNodes(ids: string[]): Promise<void> {
		const params: AWS.EC2.StopInstancesRequest = {
			InstanceIds: ids,
		};

		await this.client.stopInstances(params).promise();
	}

	/**
	 * Get status and ip of set of AWS infernet nodes.
	 *
	 * @param ids - List of node ids to get status and ip of
	 * @returns Flat array of node info objects
	 */
	async getNodesInfo(ids: string[]): Promise<NodeInfo[]> {
		const params: AWS.EC2.DescribeInstancesRequest = {
			InstanceIds: ids,
		};

		const result = await this.client.describeInstances(params).promise();

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