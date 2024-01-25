import type { Machine, ProviderInfo } from '$lib/types';

/**
 * Base abstract class for cloud providers.
 */
export abstract class BaseClient {
	/**
	 * Authenticate with the cloud provider.
	 * This method should be called before any other methods.
	 *
	 * @param JSON object containing credentials for the cloud provider.
	 * @returns A promise that resolves when authentication is complete.
	 */
	abstract auth(credentials: Record<string, any>): Promise<void>;

	/**
	 * Get the list of regions available on the cloud provider.
	 *
	 * @returns Flat array of all regions.
	 */
	abstract getRegions(): Promise<string[]>;

	/**
	 * Get the list of zones in a region.
	 *
	 * @param region The name of the region.
	 * @returns Flat array of all zones in the region.
	 */
	abstract getZones(region: string): Promise<string[]>;

	/**
	 * Get the list of machine types in a region.
	 *
	 * @param region The name of the region.
	 * @returns Flat array of all machine types in the region.
	 */
	abstract getMachines(region: string): Promise<Machine[]>;

	/**
	 * End to end method to get all provider info (regions, zones, machines).
	 *
	 * @param credentials JSON object containing credentials for the cloud provider.
	 * @returns Flat array of ProviderInfo objects.
	 */
	async getProviderInfo(credentials: Record<string, any>): Promise<ProviderInfo[]> {
		await this.auth(credentials);
		const regions = await this.getRegions();
		const providerInfo = await Promise.all(
			regions.map(async (region) => {
				const [zones, machines] = await Promise.all([
					this.getZones(region),
					this.getMachines(region)
				]);

				return {
					region: region,
					zones: zones,
					machines: machines
				} as ProviderInfo;
			})
		);
		return providerInfo;
	}
}
