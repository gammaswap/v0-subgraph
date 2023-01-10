import { PoolUpdated } from '../../generated/GammaPoolFactory/GammaPool'
import { PoolData as PoolDataSchema } from '../../generated/schema'
import { GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { BigDecimal } from '@graphprotocol/graph-ts'


export function handlePoolUpdated(event: PoolUpdated): void {
  let poolData = new PoolDataSchema(event.transaction.hash.toHex())

  let gammaPool = GammaPool.bind(event.address)
  //let tokenBalances = gammaPool.tokenBalances()
  //let borrowRate = gammaPool.borrowRate()

  poolData.address = event.address // the gammaPool contract address
  //poolData.tokenBalances = [tokenBalances[0].toBigDecimal(), tokenBalances[1].toBigDecimal()] // TODO
  poolData.lpTokenBalance = BigDecimal.fromString(event.params.lpTokenBalance.toString())
  poolData.lpTokenBorrowed = BigDecimal.fromString(event.params.lpTokenBalance.toString())
  poolData.lpTokenBorrowedPlusInterest = BigDecimal.fromString(event.params.lpTokenBorrowedPlusInterest.toString())
  poolData.lpTokenTotal = poolData.lpTokenBalance.plus(poolData.lpTokenBorrowedPlusInterest)
  poolData.lpInvariant = BigDecimal.fromString(event.params.lpInvariant.toString())
  poolData.lpBorrowedInvariant = BigDecimal.fromString(event.params.lpBorrowedInvariant.toString())
  //poolData.borrowRate = borrowRate.toBigDecimal()
  poolData.accFeeIndex = BigDecimal.fromString(event.params.accFeeIndex.toString())
  poolData.lastFeeIndex = BigDecimal.fromString(event.params.lastFeeIndex.toString())
  poolData.lastBlockNumber = event.params.lastBlockNumber

  poolData.save()
}