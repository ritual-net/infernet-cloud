// Types
import type { Machine, ProviderInfo, Region, Zone, ZoneInfo, MachineImage } from '$/types/provider'
import type { ProviderTypeEnum } from '$/types/provider'

// Functions

/**
 * Base abstract class for fetching data from cloud providers.
 */
export abstract class BaseResourceClient<T extends ProviderTypeEnum = ProviderTypeEnum> {
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
	 * @returns Flat array of all region IDs.
	 */
	abstract getRegions(): Promise<Region<T>[]>;

	/**
	 * Get the list of zones in a region.
	 *
	 * @param regionId The name of the region.
	 * @returns Flat array of all zones in the region.
	 */
	abstract getZones(regionId: string): Promise<Zone<T>[]>;

	/**
	 * Get the list of machine types in a zone.
	 *
	 * @param zoneId The name of the zone.
	 * @returns Flat array of all machine types in a zone.
	 */
	abstract getMachines(zoneId: string): Promise<Machine<T>[]>;

	/**
	 * End to end method to get all provider info (regions, zones, machines).
	 *
	 * @param credentials JSON object containing credentials for the cloud provider.
	 * @returns Flat array of ProviderInfo objects.
	 */
	async getProviderInfo(credentials: Record<string, any>): Promise<ProviderInfo[]> {
		await this.auth(credentials)

		const regions = await this.getRegions()

		return await Promise.all(
			regions.map(async (region) => {
				const zones = await this.getZones(region.id)

				return {
					region,
					zones: await Promise.all(
						zones.map(async (zone) => ({
							name: zone.name,
							machines: await this.getMachines(zone.id),
						}) as ZoneInfo)
					),
				} as ProviderInfo
			})
		);
	}

	abstract getMachineInfo(
		machineId: string,
		zoneId: string,
	): Promise<Machine<T>>

	abstract getMachineImages(
		machineId: string,
		zoneId: string,
	): Promise<MachineImage<T>[]>
}
