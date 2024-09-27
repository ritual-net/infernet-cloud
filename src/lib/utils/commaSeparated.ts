import { isTruthy } from '$/lib/utils/isTruthy'

export const serializeCommaSeparated = (stringArray: string[]) => (
	stringArray
		.join(', ')
)

export const parseCommaSeparated = (commaSeparatedString: string) => (
	commaSeparatedString
		.split(/[,\n]/)
		.map(item => item.trim())
		.filter(isTruthy)
)
