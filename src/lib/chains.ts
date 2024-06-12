export type Chain = {
	name: string
	chainId: number
}

export const chains = [
	{
		name: 'Ethereum',
		chainId: 1,
	},
	{
		name: 'Base',
		chainId: 8453,
	},
	{
		name: 'Base Sepolia',
		chainId: 84532,
	},
] as const satisfies Chain[]

export const chainsByChainId = new Map(chains.map(chain => [chain.chainId, chain]))
