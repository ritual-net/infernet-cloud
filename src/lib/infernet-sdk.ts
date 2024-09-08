export const infernetDeployments = [
	{
		version: 'v1.0.0',
		chainId: 1,
		contracts: {
			'Registry': {
				address: '0x3B1554f346DFe5c482Bb4BA31b880c1C18412170',
			},
		},
	},
	{
		version: 'v1.0.0',
		chainId: 8453,
		contracts: {
			'Registry': {
				address: '0x3B1554f346DFe5c482Bb4BA31b880c1C18412170',
			},
		},
	},
	{
		version: 'v1.0.0',
		chainId: 84532,
		contracts: {
			'Registry': {
				address: '0x3B1554f346DFe5c482Bb4BA31b880c1C18412170',
			},
		},
	},
] as const satisfies {
	version: string
	chainId: number
	contracts: {
		[contractName: string]: {
			address: string
		}
	}
}[]
