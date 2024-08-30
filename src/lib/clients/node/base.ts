import type { ProviderTypeEnum, NodeInfo } from '$/types/provider'

export abstract class BaseNodeClient {
	/**
	 * Helper utility to map client instance to type
	 */
	abstract get type(): ProviderTypeEnum

	/**
	 * Convert node config ID to node instance ID
	 */
	abstract get instanceId(): string

	/**
	 * Start Infernet node.
	 */
	abstract start(): Promise<any>

	/**
	 * Stop Infernet node.
	 */
	abstract stop(): Promise<any>

	/**
	 * Restart Infernet node.
	 */
	abstract restart(): Promise<any>

	/**
	 * Get status and IP of Infernet node.
	 */
	abstract getInfo(): Promise<NodeInfo>
}
