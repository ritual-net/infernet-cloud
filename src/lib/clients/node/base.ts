import type { ProviderTypeEnum, NodeInfo } from '$/types/provider';

export abstract class BaseNodeClient {
	/**
	 * Client object for interacting with nodes
	 */
	client: unknown;

	/**
	 * Helper utility to map client instance to type
	 */
	abstract type(): ProviderTypeEnum;

	/**
	 * Convert node config ID to node instance ID
	 */
	toInstanceId(nodeConfigId: string) {
		return `node-${nodeConfigId}`
	}

	/**
	 * Start set of infernet nodes.
	 *
	 * @param nodeConfigIds - List of node config ids to start
	 * @param args - Additional arguments needed to start nodes
	 */
	abstract startNodes(nodeConfigIds: string[], args: object): Promise<void>;

	/**
	 * Stop set of infernet nodes.
	 *
	 * @param nodeConfigIds - List of node config ids to stop
	 * @param args - Additional arguments needed to stop nodes
	 */
	abstract stopNodes(nodeConfigIds: string[], args: object): Promise<void>;

	/**
	 * Restart set of infernet nodes.
	 *
	 * @param nodeConfigIds - List of node config ids to restart
	 * @param args - Additional arguments needed to restart nodes
	 */
	abstract restartNodes(nodeConfigIds: string[], args: object): Promise<void>;

	/**
	 * Get status and ip of set of infernet nodes.
	 *
	 * @param nodeConfigIds - List of node config ids to get status and ip of
	 * @param args - Additional arguments needed to get node info
	 * @returns Flat array of node info objects
	 */
	abstract getNodesInfo(nodeConfigIds: string[], args: object): Promise<Map<string, NodeInfo | { error: unknown }>>;
}
