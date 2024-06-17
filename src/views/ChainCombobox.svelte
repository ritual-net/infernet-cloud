<script lang="ts">
	// Types/constants
	import { chains, chainsByChainId } from '$/lib/chains'


	// Inputs
	export let chainId: number | undefined


	// Functions
	const isChainId = (chainId: string | number) => (
		// @ts-ignore
		!isNaN(chainId)
	)


	// Internal state
	let inputValue = ''


	// Components
	import Combobox from '$/components/Combobox.svelte'
</script>


<Combobox
	labelText="Chain ID"
	{...$$restProps}
	bind:value={chainId}
	bind:inputValue
	items={[
		{
			value: 'infernet',
			label: 'Ritual › Infernet SDK Deployments', 
			items: chains.map(chain => ({
				value: chain.chainId,
				label: chain.name,
				icon: chain.icon,
			})),
		},
		{
			value: 'custom',
			label: 'Custom',
			items: (
				[...new Set([
					chainId,
					inputValue,
				])]
					.filter(chainId => chainId && isChainId(chainId) && !chainsByChainId.has(Number(chainId)))
					.map(chainId => ({
						value: chainId,
						label: chainId,
					}))
			),
		},
	]}
/>
