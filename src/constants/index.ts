import { Address, TypedMap, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

export namespace PoolType {
  export const UNISWAP_V2 = 1
  export const BALANCER_5050 = 2
  export const BALANCER_8020 = 3
  export const SUSHISWAP = 4
}
export namespace TransactionType {
  export const DEPOSIT_LIQUIDITY = "DEPOSIT_LIQUIDITY"
  export const WITHDRAW_LIQUIDITY = "WITHDRAW_LIQUIDITY"
  export const DEPOSIT_RESERVES = "DEPOSIT_RESERVES"
  export const WITHDRAW_RESERVES = "WITHDRAW_RESERVES"
  export const INCREASE_COLLATERAL = "INCREASE_COLLATERAL"
  export const DECREASE_COLLATERAL = "DECREASE_COLLATERAL"
  export const REBALANCE_COLLATERAL = "REBALANCE_COLLATERAL"
  export const BORROW_LIQUIDITY = "BORROW_LIQUIDITY"
  export const REPAY_LIQUIDITY = "REPAY_LIQUIDITY"
  export const LIQUIDATE = "LIQUIDATE"
  export const LIQUIDATE_WITH_LP = "LIQUIDATE_WITH_LP"
  export const BATCH_LIQUIDATION = "BATCH_LIQUIDATION"
}

// TODO: automate change of addresses
export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')
export const UNISWAPV2_ADDRESS = '0x3c0E70d7eD3E5e35C53d950B28E9723619dAd0A4'
export const FACTORY_ADDRESS = '0x85160543dF20A7b02F39baEc075Bc9842Ac41592'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ONE_BD = BigDecimal.fromString('1')
export let TEN_BI = BigInt.fromI32(10)
export let TEN_BD = BigDecimal.fromString('10')
export let SIX_BI = BigInt.fromI32(6)
export let SIX_BD = BigDecimal.fromString('6')
export let ZERO_BD = BigDecimal.fromString('0')
export let BI_18 = BigInt.fromI32(18)

export let TOKEN_MAP = new TypedMap<Address, string[]>()
TOKEN_MAP.set(Address.fromString("0xf14E85836e0BD30a87262b66a30F1f8AfF231207"), ["USD Coin", "USDC"])
TOKEN_MAP.set(Address.fromString("0x8604843aE2afDA0CfaB229B630582400bDD20AaD"), ["Wrapped Ether", "WETH"])
TOKEN_MAP.set(Address.fromString("0x0BFd518992Fa02daF9F46d20aD0bBb811A92507b"), ["Dai", "DAI"])
TOKEN_MAP.set(Address.fromString("0xe6cA75C940fde030971A1A02a5104823F40ebC01"), ["Tether USD", "USDT"])
TOKEN_MAP.set(Address.fromString("0xa88BaBC14F8Ea1525bd654192222e31844eD8277"), ["Uniswap", "UNI"])
TOKEN_MAP.set(Address.fromString("0x1AD744324a29c1064f08f197E312390C28f89440"), ["Compound", "COMP"])
TOKEN_MAP.set(Address.fromString("0xa64D081b8e7445642b458055Ff91DEb4bA5BC744"), ["Chainlink", "LINK"])
TOKEN_MAP.set(Address.fromString("0x048Df6A044A2C04F5aBBaf8525F17aCeC6764E2b"), ["Basic Attention Token", "BAT"])
TOKEN_MAP.set(Address.fromString("0xE6d6fA62efc2B8e1959aa3DE0EceEbf1946645bf"), ["Wrapped Bitcoin", "WBTC"])