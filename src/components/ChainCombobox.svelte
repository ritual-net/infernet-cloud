<script lang="ts">
	// Types/constants
	import { chains, chainsByChainId } from '$/lib/chains'


	// Inputs
	export let chainId: number | undefined


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
			label: 'Ritual › Infernet Deployments', 
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
				[
					chainId,
					inputValue,
				]
					.filter(chainId => chainId && !(chainId in chainsByChainId))
					.map(chainId => ({
						value: chainId,
						label: chainId,
					}))
			),
		},
	]}
/>
