import type { ProviderTypeEnum, NodeInfo } from '$/types/provider'

export abstract class BaseNodeClient {
	/**
	 * Helper utility to map client instance to type
	 */
	abstract get type(): ProviderTypeEnum

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

	/**
	 * Get logs from Infernet node.
	 */
	abstract getLogs(start?: number): Promise<{
		start?: number,
		next?: number,
		logs: {
			timestamp: number,
			source?: string,
			text: string,
		}[],
	}>
}
