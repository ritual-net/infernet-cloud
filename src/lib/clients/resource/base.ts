import type { Machine, ProviderInfo, ZoneInfo } from '$/types/provider';

/**
 * Base abstract class for fetching data from cloud providers.
 */
export abstract class BaseResourceClient {
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

		return await Promise.all(
			regions.map(async (region) => {
				const [
					machines,
					zones,
				] = await Promise.all([
					this.getMachines(region),
					this.getZones(region),
				])

				return {
					region,
					zones: zones.map((zone) => ({
						name: zone,
						machines,
					} as ZoneInfo)),
				} as ProviderInfo;
			})
		);
	}
}
