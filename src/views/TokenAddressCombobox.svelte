<script lang="ts">
	// Types
	import { Address } from '$/types/stringFormats'
	import type { Token } from '$/lib/tokens'


	// Inputs
	export let tokens: Token[] | undefined
	export let value: `0x${string}` | undefined
	export let menuPlaceholder: string | undefined


	// Functions
	import { isTruthy } from '$/lib/utils/isTruthy'

	const isAddress = (address: string) => (
		Address.isValidSync(address)
	)


	// Internal state
	let inputValue = ''


	// Components
	import Combobox from '$/components/Combobox.svelte'
</script>


<Combobox
	bind:value
	bind:inputValue
	placeholder={
		tokens?.length
			? `Choose token or enter address...`
			: `Enter token address...`
	}
	{...$$restProps}
	menuPlaceholder={
		menuPlaceholder
		?? (
			tokens?.length
				? `No results found.`
				: `Enter token address...`
		)
	}
	items={
		[
			tokens?.length && {
				value: 'common',
				label: 'Common',
				items: tokens.map(token => ({
					value: token.address,
					label: token.name,
					icon: token.icon,
				})),
			},
			(
				isAddress(inputValue)
				&& !tokens?.some(token => token.address.toLowerCase() === inputValue.trim().toLowerCase())
			) && {
				value: 'custom',
				label: 'Custom',
				items: (
					[
						{
							value: inputValue.trim(),
							label: inputValue.trim(),
						}
					]
						.filter(isTruthy)
				),
			},
		]
			.filter(isTruthy)
	}
/>
