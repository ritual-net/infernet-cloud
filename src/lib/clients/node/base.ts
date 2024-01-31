import type { ProviderTypeEnum, NodeInfo } from '$/types/provider';

export interface BaseNodeClient {
	/**
	 * Client object for interacting with nodes
	 */
	client: unknown;
	/**
	 * Helper utility to map client instance to type
	 */
	type(): ProviderTypeEnum;

	/**
	 * Start set of infernet nodes.
	 *
	 * @param ids - List of node ids to start
	 * @param args - Additional arguments needed to start nodes
	 */
	startNodes(ids: string[], args: object): Promise<void>;

	/**
	 * Stop set of infernet nodes.
	 *
	 * @param ids - List of node ids to stop
	 * @param args - Additional arguments needed to stop nodes
	 */
	stopNodes(ids: string[], args: object): Promise<void>;

	/**
	 * Get status and ip of set of infernet nodes.
	 *
	 * @param ids - List of node ids to get status and ip of
	 * @param args - Additional arguments needed to get node info
	 * @returns Flat array of node info objects
	 */
	getNodesInfo(ids: string[], args: object): Promise<NodeInfo[]>;
}
