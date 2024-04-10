export const serializeEnvObject = (envObject: Record<string, string>) => (
	Object.entries(envObject ?? {})
		.map(([key, value]) => `${key}=${value}`)
		.join('\n')
)

export const parseEnvString = (envString: string) => (
	Object.fromEntries(
		envString
			.matchAll(/(\w+)=(.*\S|)/g)
			.map(([match, key, value]) => [key, value])
	)
)
