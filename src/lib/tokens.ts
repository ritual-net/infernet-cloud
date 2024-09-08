// Types
export type Token = {
	name: string
	address: `0x${string}`
	decimals: number
	icon: string
}


// Components
import ETHIcon from '$/icons/tokens/ETH.svg'
import USDCIcon from '$/icons/tokens/USDC.svg'


// Constants
export const tokensByChainId = {
	1: [
		{
			name: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			icon: ETHIcon,
		},
		{
			name: 'USDC',
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			decimals: 6,
			icon: USDCIcon,
		},
	],

	8453: [
		{
			name: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			icon: ETHIcon,
		},
		{
			name: 'USDC',
			address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
			decimals: 6,
			icon: USDCIcon,
		},
	],

	84532: [
		{
			name: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			icon: ETHIcon,
		},
		{
			name: 'USDC',
			address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
			decimals: 6,
			icon: USDCIcon,
		},
	],
} as const satisfies Record<number, Token[]>
