export const formatNumberCompact = (
	number: number,
) => (
	new Intl.NumberFormat(
		[...globalThis.navigator.languages],
		{
			notation: 'compact',
			compactDisplay: 'short',
			minimumSignificantDigits: 2,
		},
	)
		.format(number)
)
