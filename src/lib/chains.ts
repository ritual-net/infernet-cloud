// Types
export type Chain = {
	name: string
	chainId: number
	icon?: string
	isTestnet?: boolean
}


// Components
import ETHIcon from '$/icons/tokens/ETH.svg'
import BaseIcon from '$/icons/networks/Base.svg'


// Constants
export const chains = [
	{
		name: 'Ethereum',
		chainId: 1,
		icon: ETHIcon,
	},
	{
		name: 'Base',
		chainId: 8453,
		icon: BaseIcon,
	},
	{
		name: 'Base Sepolia',
		chainId: 84532,
		icon: BaseIcon,
		isTestnet: true,
	},
] as const satisfies Chain[]

export const chainsByChainId = new Map(chains.map(chain => [chain.chainId, chain]))
