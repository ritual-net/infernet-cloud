export const serializeCommaSeparated = (stringArray: string[]) => (
	stringArray
		.join(', ')
)

export const parseCommaSeparated = (commaSeparatedString: string) => (
	commaSeparatedString
		.split(',')
		.map(item => item.trim())
		.filter(Boolean)
)
