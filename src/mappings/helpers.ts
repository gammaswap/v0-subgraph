import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const UNISWAV2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
export const GAMMAPOOL_FACTORY_ADDRESS = '0x862654Cfa91cEfb48A3D55108c353eC2Bca1794A'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let SIX_BI = BigInt.fromI32(6)
export let SIX_BD = BigDecimal.fromString('6')
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

// TODO: adjust types
export function calcLPTokenBorrowedPlusInterest(
  borrowedInvariant: BigInt,
  lastCFMMTotalSupply: BigInt,
  lastCFMMInvariant: BigInt
): BigInt {
  if (lastCFMMInvariant != ZERO_BI) {
    let lpTokenBorrowedPlusInterest = (borrowedInvariant.times(lastCFMMTotalSupply)).div(lastCFMMInvariant)
    return lpTokenBorrowedPlusInterest
  }

  return ZERO_BI
}
