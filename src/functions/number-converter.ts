import { BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { ONE_BI, ZERO_BI, TEN_BD, ONE_BD } from '../constants'

export function tokenToDecimals(amount: BigInt, decimals: BigInt): BigDecimal {
  if (decimals === ZERO_BI) return amount.toBigDecimal()

  return amount.toBigDecimal().div(exponentToDecimals(decimals))
}

function exponentToDecimals(decimals: BigInt): BigDecimal {
  let num = ONE_BD
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    num = num.times(TEN_BD)
  }
  return num
}