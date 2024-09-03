<script lang="ts">
	// Types/constants
	import * as z from 'yup'
	import type { InputConstraints } from 'sveltekit-superforms'
	import type { ServiceAccount } from '$schema/interfaces'
	import type { BaseResourceClient } from '$/lib/clients/resource/base'
	import type { ClusterConfig, NodeConfig, RouterConfig } from './schema'
	import { providers, type Machine } from '$/types/provider'
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

	export let constraints: Pick<InputConstraints<z.InferType<typeof ClusterConfig> | z.InferType<typeof RouterConfig> | z.InferType<typeof NodeConfig>>, 'region' | 'zone' | 'machine_type' | 'machine_image'> | undefined 


	// Outputs
	export let regionId: string | undefined | null
	export let zoneId: string | undefined | null
	export let machineId: string | undefined | null
	export let machineImageId: string | undefined | null  // Add this line
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

	$: machineTypesQuery = createQuery({
		queryKey: ['machineTypeConfig', {
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

	$: machineTypes = $machineTypesQuery.data

	$: selectedMachineType = (
		machineTypes && machineId
			? machineTypes
				.find(machine => (
					machine.id === machineId
				))
			: undefined
	)

	$: machineTypeInfoQuery = createQuery({
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
			) as Machine
		),
	})

	$: machineTypeInfo = $machineTypeInfoQuery.data

	$: if(machineTypeInfo)
		hasGpu = machineTypeInfo.hasGpu

	$: machineImagesQuery = createQuery({
		queryKey: ['machineImageConfig', {
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
					resolveRoute('/api/providers/[serviceAccountId]/regions/[regionId]/zones/[zoneId]/machines/[machineId]/images', {
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

	$: machineImages = $machineImagesQuery.data

	$: selectedMachineImage = (
		machineImages && machineImageId
			? machineImages
				.find(image => (
					image.id === machineImageId
				))
			: undefined
	)

	$: machineImageInfoQuery = createQuery({
		queryKey: ['machineImageInfo', {
			serviceAccountId: serviceAccount?.id,
			regionId: regionId!,
			zoneId: zoneId!,
			machineId: machineId!,
			machineImageId: machineImageId!,
		}] as const,

		queryFn: async ({
			queryKey: [_, {
				serviceAccountId,
				regionId,
				zoneId,
				machineId,
				machineImageId,
			}],
		}) => (
			serviceAccountId && (
				await fetch(
					resolveRoute('/api/providers/[serviceAccountId]/regions/[regionId]/zones/[zoneId]/machines/[machineId]/images/[machineImageId]', {
						serviceAccountId,
						regionId,
						zoneId,
						machineId,
						machineImageId,
					})
				)
					.then(response => response.json())
			) as Machine
		),
	})

	$: machineImageInfo = $machineImageInfoQuery.data


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import Combobox from '$/components/Combobox.svelte'
	import DetailsValue from '$/components/DetailsValue.svelte'
	import ScrollArea from '$/components/ScrollArea.svelte'
	import SizeTransition from '$/components/SizeTransition.svelte'
	import Switch from '$/components/Switch.svelte'
	import WithIcon from '$/components/WithIcon.svelte'


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
						<span class="annotation">Override Default</span>

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
								{#if entityType === 'cluster'}
									Default region
								{:else}
									Region
								{/if}
							</label>
						</h4>

						<p>
							Select the
							{#if entityType === 'cluster'}
								default
							{/if}
							<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].regionsInfoLink : ''} target="_blank">
								{serviceAccount ? `${serviceAccount.provider} ` : ''}region
							</a>
							to deploy
							{#if entityType === 'cluster'}
								router/nodes to.
							{:else}
								your {entityType} to.
							{/if}
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
									loading: true,
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
								{#if entityType === 'cluster'}
									Default zone
								{:else}
									Zone
								{/if}
							</label>
						</h4>

						<p>
							Select the
							{#if entityType === 'cluster'}
								default
							{/if}
							<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].regionsInfoLink : ''} target="_blank">
								{serviceAccount ? `${serviceAccount.provider} ` : ''}zone
							</a>
							{#if entityType === 'cluster'}
								to deploy router/nodes to.
							{:else}
								to deploy your {entityType} to.
							{/if}
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
										$machineTypesQuery.isPending
											? 'Loading available zones...'
											: 'Choose a region first.'
									),
									items: [
										zoneId && {
											value: zoneId,
											label: zoneId,
										}
									].filter(Boolean),
									loading: true,
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
			<SizeTransition>
				<section class="column">
					<div class="row wrap">
						<div class="column inline">
							<h3>
								Machine
							</h3>
						</div>
					</div>

					<div class="row equal wrap">
						<div class="column">
							<div class="column inline">
								<h4>
									<label for="{namePrefix}.machine_type">
										Type
									</label>
								</h4>

								<p>
									Select the
									<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].machineTypesLink : ''} target="_blank">
										{serviceAccount ? `${serviceAccount.provider} ` : ''}machine type
									</a>
									to deploy your {entityType} on.
								</p>
							</div>

							<Combobox
								id="{namePrefix}.machine_type"
								name="{namePrefix}.machine_type"
								labelText="Machine type"
								bind:value={machineId}
								{...!machineTypes
									? {
										placeholder: (
											$machineTypesQuery.isPending
												? 'Loading available machine types...'
												: 'Choose a zone first.'
										),
										items: [
											machineId && {
												value: machineId,
												label: machineId,
											}
										].filter(Boolean),
										loading: true,
										visuallyDisabled: true,
									}
									: {
										placeholder: 'Choose machine type...',
										items: (
											Array.from(
												(
													Map.groupBy(
														machineTypes,
														machineConfig => machineConfig.hasGpu
													)
														.entries()
												),
												([hasGpu, machineConfigs]) => ({
													value: hasGpu,
													label: hasGpu ? 'GPU-Enabled' : 'No GPU',
													items: machineConfigs.map(machineConfig => ({
														value: machineConfig.id,
														label: `${machineConfig.name}${machineConfig.description ? ` (${machineConfig.description})` : ''}`,
													}))
												})
											)
										),
									}
								}
								{...constraints?.machine_type}
							/>

							{#if machineTypeInfo?.info}
								<Collapsible
									class="card"
								>
									<svelte:fragment slot="trigger">
										<header class="row" data-after="▾">
											<WithIcon
												icon={serviceAccount && providers[serviceAccount.provider].icon}
											>
												{machineTypeInfo.name ?? selectedMachineType?.id}
											</WithIcon>
										</header>
									</svelte:fragment>

									<ScrollArea
										layout="nested"
									>
										<div>
											<DetailsValue
												value={machineTypeInfo.info}
											/>
										</div>
									</ScrollArea>
								</Collapsible>
							{/if}
						</div>

						<div class="column">
							<div class="column inline">
								<h4>
									<label for="{namePrefix}.machine_image">
										Image
									</label>
								</h4>

								<p>
									Select the
									<a href={serviceAccount ? providerRegionsAndZones[serviceAccount.provider].machineImagesLink : ''} target="_blank">
										{serviceAccount ? `${serviceAccount.provider} ` : ''}image
									</a>
									to deploy your {entityType} on.
								</p>
							</div>

							<Combobox
								id="{namePrefix}.machine_image"
								name="{namePrefix}.machine_image"
								labelText="Machine image"
								bind:value={machineImageId}
								{...!machineImages
									? {
										placeholder: (
											$machineImagesQuery.isPending
												? 'Loading available machine images...'
												: 'Choose a machine type first.'
										),
										items: [
											machineImageId && {
												value: machineImageId,
												label: machineImageId,
											}
										].filter(Boolean),
										loading: true,
										visuallyDisabled: true,
									}
									: {
										placeholder: 'Choose machine image...',
										items: machineImages.map(imageConfig => ({
											value: imageConfig.id,
											label: imageConfig.name,
										})),
									}
								}
								{...constraints?.machine_image}
							/>

							{#if machineImageInfo?.info}
								<Collapsible
									class="card"
								>
									<svelte:fragment slot="trigger">
										<header class="row" data-after="▾">
											<WithIcon
												icon={serviceAccount && providers[serviceAccount.provider].icon}
											>
												{machineImageInfo.name ?? selectedMachineImage?.id}
											</WithIcon>
										</header>
									</svelte:fragment>
		
									<ScrollArea
										layout="nested"
									>
										<div>
											<DetailsValue
												value={machineImageInfo.info}
											/>
										</div>
									</ScrollArea>
								</Collapsible>
							{/if}
						</div>
					</div>
				</section>
			</SizeTransition>
		{/if}
	</fieldset>

	{#if !serviceAccount}
		<div
			class="floating-status card warning"
			transition:scale|global
		>
			<p>Choose a cloud account first.</p>
		</div>
	{:else}
		{#if $regionsQuery.isPending}
			<div
				class="floating-status card loading row"
				transition:scale|global
			>
				<img class="icon" src={providers[serviceAccount.provider].icon} />
				<p>Loading available cloud configurations...</p>
			</div>
		{:else if $regionsQuery.isError}
			<div
				class="floating-status card error row"
				transition:scale|global
			>
				<img class="icon" src={providers[serviceAccount.provider].icon} />
				<p>Couldn't load available cloud configurations. Please try again.</p>
			</div>
		{/if}
	{/if}
</div>


<style>
	.floating-status {
		position: relative;
		place-self: center;
	}

	.icon {
		width: 1.5em;
		height: 1.5em;
	}
</style>
