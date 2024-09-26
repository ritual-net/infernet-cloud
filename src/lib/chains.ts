// Types
export type Chain = {
	name: string
	chainId: number
	icon?: string
	isTestnet?: boolean
	explorer?: string
}


// Components
import ETHIcon from '$/icons/tokens/ETH.svg'
import BaseIcon from '$/icons/networks/Base.svg'


// Constants
export const chains: Chain[] = [
	{
		name: 'Ethereum',
		chainId: 1,
		icon: ETHIcon,
		explorer: 'https://eth.blockscout.com',
	},
	{
		name: 'Base',
		chainId: 8453,
		icon: BaseIcon,
		explorer: 'https://base.blockscout.com',
	},
	{
		name: 'Base Sepolia',
		chainId: 84532,
		icon: BaseIcon,
		isTestnet: true,
		explorer: 'https://base-sepolia.blockscout.com',
	},
]

export const chainsByChainId = new Map(chains.map(chain => [chain.chainId, chain]))
