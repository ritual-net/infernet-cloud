export const formatNumberCompact = (number: number) =>
	new Intl.NumberFormat(globalThis.navigator ? [...globalThis.navigator?.languages] : 'en-US', {
		notation: 'compact',
		compactDisplay: 'short',
		minimumSignificantDigits: 2,
	}).format(number);
