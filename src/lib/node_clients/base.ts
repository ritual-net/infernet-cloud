import { type ProviderType } from "$types";

export interface BaseClient {
  /**
   * Client object for interacting with provider
   */
  client: unknown;
  /**
   * Helper utility to map provider to type
   */
  type(): ProviderType;

  // getClusterStatus(): Promise<void>;
  // getClusterConfig(): Promise<void>;
  // getClusterInfo(): Promise<void>;

  // Start node
  /**
   *
    For GCP, extra args should be.
      - zone
      - project
    - id = NAME of the node
    
    For AWS, extra no args.
    - id = ID of the node
   */

  startNodes(ids: string[], args: object): Promise<void>;
  // Stop node
  stopNodes(ids: string[], args: object): Promise<void>;
  // Get node status
  getNodesStatus(ids: string[], args: object): Promise<Map<string, any>>;
}