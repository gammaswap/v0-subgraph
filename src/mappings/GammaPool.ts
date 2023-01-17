import { LoanUpdated, PoolUpdated } from '../../generated/GammaPoolFactory/GammaPool'
import { PoolData as PoolDataSchema } from '../../generated/schema'
import { LoanData as LoanDataSchema } from '../../generated/schema'
import { Pool as PoolSchema } from '../../generated/schema'
import { GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'



export function handlePoolUpdated(event: PoolUpdated): void {
  let poolData = new PoolDataSchema(event.transaction.hash.toHex())
  let gammaPool = GammaPool.bind(event.address)
  let Pool = PoolSchema.load(event.address.toHexString())

  poolData.address = event.address // the gammaPool contract address
  poolData.lpTokenBalance = event.params.lpTokenBalance
  poolData.lpTokenBorrowed = event.params.lpTokenBorrowed
  poolData.lpTokenBorrowedPlusInterest = event.params.lpTokenBorrowedPlusInterest
  poolData.lpTokenTotal = BigInt.fromString(poolData.lpTokenBalance.plus(poolData.lpTokenBorrowedPlusInterest).toString())
  poolData.lpInvariant = event.params.lpInvariant
  poolData.lpBorrowedInvariant = event.params.lpBorrowedInvariant
  poolData.lpTotalInvariant = BigInt.fromString(poolData.lpInvariant.plus(poolData.lpBorrowedInvariant).toString())
  poolData.lpUtilizationRate = BigDecimal.fromString(poolData.lpBorrowedInvariant.toBigDecimal().div(poolData.lpTotalInvariant.toBigDecimal()).toString())
  poolData.lastBlockNumber = event.params.lastBlockNumber
  poolData.blockNumber = event.block.number

  poolData.price = BigInt.fromI32(1) // dummy price: CFMM_RESERVES[1] / CFMM_RESERVES[0] 
  poolData.suppliedLiquidity = BigInt.fromString( //2 * TOTAL_INVARIANT * sqrt(price)
    BigInt.fromString('2')
      .times(poolData.lpTotalInvariant)
      .times(poolData.price.sqrt())
      .toString())

  poolData.borrowedLiquidity = BigInt.fromString( //2 * BORROWED_INVARIANT * sqrt(price)
    BigInt.fromString('2')
      .times(poolData.lpBorrowedInvariant)
      .times(poolData.price.sqrt())
      .toString())

  if (Pool) {
    //first time the poolData gets changed, since it gets initialized with blockNumber 0 on PoolCreation
    if (Pool.blockNumber.toString() == "0") {
      Pool.blockNumber = event.block.number
      Pool.newAccFeeIndex = event.params.accFeeIndex
      Pool.oldAccFeeIndex = event.params.accFeeIndex
      Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
    }
    //in same block, keep updating the newFee, because the newFee turns into the oldFee when the block finishes
    else if (event.block.number == Pool.blockNumber) {
      Pool.newAccFeeIndex = event.params.accFeeIndex
      Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
    }
    //in new blocks, the value of oldFee is set to newFee and newFee gets the new event value
    else if (event.block.number > Pool.blockNumber) {
      Pool.blockNumber = event.block.number
      Pool.oldAccFeeIndex = Pool.newAccFeeIndex
      Pool.newAccFeeIndex = event.params.accFeeIndex
      Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
    }
    poolData.totalCollateral = BigInt.fromString( //TOKEN_BALANCE[0] * price + TOKEN_BALANCE[1]
      Pool.tokenBalances[0]
        .times(poolData.price)
        .times(Pool.tokenBalances[1])
        .toString())

    Pool.save()
  }

  poolData.save()
}

export function handleLoanUpdated(event: LoanUpdated): void {
  let loanData = new LoanDataSchema(event.transaction.hash.toHex())
  let pool = PoolSchema.load(event.address.toHexString())
  //MISSING: poolID, heldLiquidity
  if (pool) {
    loanData.tokensHeld = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
    pool.tokenBalances = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
    pool.save()
  }
  loanData.liquidity = event.params.liquidity
  loanData.lpTokens = event.params.lpTokens
  loanData.rateIndex = event.params.rateIndex
  loanData.collateral = BigInt.fromString(
    (loanData.tokensHeld[0]
      .times(loanData.tokensHeld[1]))
      .sqrt()
      .toString())

  loanData.loanToValue = BigDecimal.fromString(
    loanData.liquidity.toBigDecimal()
      .div(loanData.collateral.toBigDecimal())
      .toString())
  loanData.blockNumber = event.block.number
  loanData.save()

}