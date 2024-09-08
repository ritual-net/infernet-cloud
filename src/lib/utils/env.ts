export const serializeEnvObject = (envObject: Record<string, string>) => (
	Object.entries(envObject ?? {})
		.map(([key, value]) => `${key}=${value}`)
		.join('\n')
)

export const parseEnvString = (envString: string) => (
	Object.fromEntries(
		Array.from(
			envString.matchAll(/(\w+)=(.*\S|)/g),
			([match, key, value]) => [key, value]
		)
	)
)
