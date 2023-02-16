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


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const UNISWAPV2_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
export const FACTORY_ADDRESS = '0x862654Cfa91cEfb48A3D55108c353eC2Bca1794A'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let SIX_BI = BigInt.fromI32(6)
export let SIX_BD = BigDecimal.fromString('6')
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let TOKEN_MAP = new TypedMap<Address, string[]>()
TOKEN_MAP.set(Address.fromString("0x254676d5247b127770ef626D6919d9A19156F5B6"), ["USD Coin", "USDC"])
TOKEN_MAP.set(Address.fromString("0xE9e8b7F5b8A0d5A6700B1cDA1D85EE9134ee2B29"), ["Wrapped Ether", "WETH"])
TOKEN_MAP.set(Address.fromString("0x97b762E3D60d1f0016626Bd48B574bf2FAAd943a"), ["Dai", "DAI"])
TOKEN_MAP.set(Address.fromString("0x1D68c943Afd9D8Ada9617A624dA46a20721D5754"), ["Tether USD", "USDT"])
TOKEN_MAP.set(Address.fromString("0x728265e78327F3F09F990F5aABC84bdf05C8b573"), ["Uniswap", "UNI"])
TOKEN_MAP.set(Address.fromString("0x8De27c8Bf29d1063C0E7166f40088Be8E47A7F79"), ["Compound", "COMP"])
TOKEN_MAP.set(Address.fromString("0x5480CB0A9e2DCe3AFE9ACf41a201db054B8943b2"), ["Chainlink", "LINK"])
TOKEN_MAP.set(Address.fromString("0xb77A4E57DDE347EC7f6b3Ee7A30c4370c9bA1E7b"), ["Basic Attention Token", "BAT"])
TOKEN_MAP.set(Address.fromString("0x3E3B7004Ffd2DA318Af89852982f06c7b6Cc471A"), ["Wrapped Bitcoin", "WBTC"])