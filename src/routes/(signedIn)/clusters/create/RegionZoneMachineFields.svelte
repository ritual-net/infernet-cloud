<script lang="ts">
	// Types/constants
	import * as z from 'yup'
	import type { InputConstraints } from 'sveltekit-superforms'
	import type { ServiceAccount } from '$schema/interfaces'
	import type { BaseResourceClient } from '$/lib/clients/resource/base'
	import type { Config, NodeConfig, RouterConfig } from './schema'
	import { providers } from '$/types/provider'
	import { providerRegionsAndZones } from '$/lib/utils/providers/common'


	// Functions
	import { createQuery } from '@tanstack/svelte-query'
	import { resolveRoute } from '$app/paths'


	// Inputs
	export let entityType: 'cluster' | 'router' | 'node' = 'cluster'

	export let namePrefix = 'cluster'

	export let serviceAccount: ServiceAccount | undefined

	export let defaults: {
		region?: string
		zone?: string
	} | undefined

	export let constraints: Pick<InputConstraints<z.InferType<typeof Config> | z.InferType<typeof RouterConfig> | z.InferType<typeof NodeConfig>>, 'region' | 'zone' | 'machine_type'> | undefined 


	// Outputs
	export let regionId: string | undefined | null
	export let zoneId: string | undefined | null
	export let machineId: string | undefined | null
	export let hasGpu: boolean | undefined | null


	// Internal state
	let overrideDefaultRegionAndZone = false

	$: if(defaults && !overrideDefaultRegionAndZone)
		regionId = defaults.region

	$: if(defaults && !overrideDefaultRegionAndZone)
		zoneId = defaults.zone

	// (Regions/Zones/Machines)
	$: regionsQuery = createQuery({
		queryKey: ['regionConfig', {
			serviceAccountId: serviceAccount?.id,
		}] as const,

		queryFn: async ({
			queryKey: [_, {
				serviceAccountId,
			}],
		}) => (
			serviceAccountId && (
				await fetch(
					resolveRoute('/api/providers/[serviceAccountId]/regions', {
						serviceAccountId,
					})
				)
					.then(response => response.json())
			)
		) as Awaited<ReturnType<BaseResourceClient['getRegions']>>,
	})

	$: regions = $regionsQuery.data

	$: selectedRegion = (
		regions && regionId
			? regions
				.find(region => (
					region.id === regionId
				))
			: undefined
	)

	$: zonesQuery = createQuery({
		queryKey: ['zoneConfig', {
			serviceAccountId: serviceAccount?.id,
			regionId: regionId!,
		}] as const,

		queryFn: async ({
			queryKey: [_, {
				serviceAccountId,
				regionId,
			}],
		}) => (
			serviceAccountId && (
				await fetch(
					resolveRoute('/api/providers/[serviceAccountId]/regions/[regionId]/zones', {
						serviceAccountId,
						regionId,
					})
				)
					.then(response => response.json())
			)
		) as Awaited<ReturnType<BaseResourceClient['getZones']>>,
	})

	$: zones = $zonesQuery.data

	$: selectedZone = (
		selectedRegion && zones && zoneId
			? zones
				.find(zone => (
					zone.id === zoneId
				))
			: undefined
	)

	$: machinesQuery = createQuery({
		queryKey: ['machineConfig', {
			serviceAccountId: serviceAccount?.id,
			regionId: regionId!,
			zoneId: zoneId!,
		}] as const,

		queryFn: async ({
			queryKey: [_, {
				serviceAccountId,
				regionId,
				zoneId,
			}],
		}) => (
			serviceAccountId && (
				await fetch(
					resolveRoute('/api/providers/[serviceAccountId]/regions/[regionId]/zones/[zoneId]/machines', {
						serviceAccountId,
						regionId,
						zoneId,
					})
				)
					.then(response => response.json())
			)
		) as Awaited<ReturnType<BaseResourceClient['getMachines']>>,
	})

	$: machines = $machinesQuery.data

	$: selectedMachine = (
		machines && machineId
			? machines
				.find(machine => (
					machine.id === machineId
				))
			: undefined
	)

	$: machineInfoQuery = createQuery({
		queryKey: ['machineInfo', {
			serviceAccountId: serviceAccount?.id,
			regionId: regionId!,
			zoneId: zoneId!,
			machineId: machineId!,
		}] as const,

		queryFn: async ({
			queryKey: [_, {
				serviceAccountId,
				regionId,
				zoneId,
				machineId,
			}],
		}) => (
			serviceAccountId && (
				await fetch(
					resolveRoute('/api/providers/[serviceAccountId]/regions/[regionId]/zones/[zoneId]/machines/[machineId]', {
						serviceAccountId,
						regionId,
						zoneId,
						machineId,
					})
				)
					.then(response => response.json())
			)
		),
	})

	$: machineInfo = $machineInfoQuery.data

	$: if(machineInfo)
		hasGpu = machineInfo.hasGpu


	// Components
	import Combobox from '$/components/Combobox.svelte'
	import Switch from '$/components/Switch.svelte'


	// Transitions/animations
	import { scale } from 'svelte/transition'
</script>


<div class="stack">
	<fieldset
		class="column"
		disabled={!$regionsQuery.isSuccess}
	>
		<section class="column">
			<div class="row wrap">
				<h3>
					Location
				</h3>

				{#if defaults}
					<label class="row">
						<span class="annotation">Override Cluster</span>

						<Switch
							id="{namePrefix}.region.override"
							name="{namePrefix}.region.override"
							bind:checked={overrideDefaultRegionAndZone}
							labelText="Override"
						/>
					</label>
				{/if}
			</div>

			<div class="row equal wrap">
				<div class="column">
					<div class="column inline">
						<h4>
							<label for="{namePrefix}.region">
								Region
							</label>
						</h4>

						<p>
							Select the
							<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].regionsInfoLink : ''} target="_blank">
								{serviceAccount ? `${serviceAccount.provider} ` : ''}region
							</a>
							to deploy your {entityType} to.
						</p>
					</div>

					{#if defaults?.region ? overrideDefaultRegionAndZone : true}
						<Combobox
							id="{namePrefix}.region"
							name="{namePrefix}.region"
							labelText="Region"
							bind:value={regionId}
							{...!regions
								? {
									placeholder: 'Loading available regions...',
									items: [
										regionId && {
											value: regionId,
											label: regionId,
										}
									].filter(Boolean),
									visuallyDisabled: true,
								}
								: {
									placeholder: (
										'Choose region...'
									),
									items: (
										// Group by continents
										Object.entries(
											Object.groupBy(
												regions,
												regionConfig => (
													regionConfig.continent
												)
											)
										)
											.map(([continent, configs]) => ({
												value: continent,
												label: continent,
												items: configs.map(regionConfig => ({
													value: regionConfig.id,
													label: `${regionConfig.id} – ${regionConfig.name}`,
												}))
											}))
									),
								}
							}
							{...constraints?.region}
						/>
					{:else}
						<input
							type="text"
							name="{namePrefix}.region"
							value={regionId ?? ''}
							disabled
						/>
					{/if}
				</div>

				<div class="column">
					<div class="column inline">
						<h4>
							<label for="{namePrefix}.zone">
								Zone
							</label>
						</h4>

						<p>
							Select the
							<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].regionsInfoLink : ''} target="_blank">
								{serviceAccount ? `${serviceAccount.provider} ` : ''}zone
							</a>
							to deploy your {entityType} to.
						</p>
					</div>

					{#if defaults?.region ? overrideDefaultRegionAndZone : true}
						<Combobox
							id="{namePrefix}.zone"
							name="{namePrefix}.zone"
							labelText="Zone"
							bind:value={zoneId}
							{...!zones
								? {
									placeholder: (
										$machinesQuery.isPending
											? 'Loading available zones...'
											: 'Choose a region first.'
									),
									items: [
										zoneId && {
											value: zoneId,
											label: zoneId,
										}
									].filter(Boolean),
									visuallyDisabled: true,
								}
								: {
									placeholder: 'Choose zone...',
									items: (
										zones
											.map(zoneConfig => ({
												value: zoneConfig.id,
												label: zoneConfig.id,
											}))
									),
								}
							}
							{...constraints?.zone}
						/>
					{:else}
						<input
							type="text"
							name="{namePrefix}.zone"
							value={zoneId ?? ''}
							disabled
						/>
					{/if}
				</div>
			</div>
		</section>

		{#if entityType !== 'cluster'}
			<section class="column">
				<div class="row wrap">
					<div class="column inline">
						<h3>
							<label for="{namePrefix}.machine_type">
								Machine type
							</label>
						</h3>

						<p>Select the type of machine you would like to deploy.</p>
					</div>

					<Combobox
						id="{namePrefix}.machine_type"
						name="{namePrefix}.machine_type"
						labelText="Machine type"
						bind:value={machineId}
						{...!machines
							? {
								placeholder: (
									$machinesQuery.isPending
										? 'Loading available machine types...'
										: 'Choose a zone first.'
								),
								items: [
									machineId && {
										value: machineId,
										label: machineId,
									}
								].filter(Boolean),
								visuallyDisabled: true,
							}
							: {
								placeholder: 'Choose machine type...',
								items: (
									Array.from(
										(
											Map.groupBy(
												machines,
												machineConfig => machineConfig.hasGpu
											)
												.entries()
										),
										([hasGpu, machineConfigs]) => ({
											value: hasGpu,
											label: hasGpu ? 'GPU-Enabled' : 'No GPU',
											items: machineConfigs.map(machineConfig => ({
												value: machineConfig.id,
												label: `${machineConfig.name} (${machineConfig.description})`,
											}))
										})
									)
								),
							}
						}
						{...constraints?.machine_type}
					/>
				</div>
			</section>
		{/if}
	</fieldset>

	{#if !serviceAccount}
		<div
			class="loading-status card row"
			transition:scale|global
		>
			<p>Choose a cloud account first.</p>
		</div>
	{:else}
		{#if $regionsQuery.isPending}
			<div
				class="loading-status card row"
				transition:scale|global
			>
				<img class="icon" src={providers[serviceAccount.provider].icon} />
				<p>Loading available cloud configurations...</p>
			</div>
		{:else if $regionsQuery.isError}
			<div
				class="loading-status card row"
				transition:scale|global
			>
				<img class="icon" src={providers[serviceAccount.provider].icon} />
				<p>Couldn't load available cloud configurations. Please try again.</p>
			</div>
		{/if}
	{/if}
</div>


<style>
	.loading-status {
		position: relative;
		place-self: center;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>

