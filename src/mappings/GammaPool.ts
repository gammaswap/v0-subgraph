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


  if (Pool) {
    //first time the poolData gets changed, since it gets initialized with blockNumber 0 on PoolCreation
    if (Pool.blockNumber.toString() == "0") {
      Pool.blockNumber = event.block.number
      Pool.newAccFeeIndex = BigInt.fromString(event.params.accFeeIndex.toString())
      Pool.oldAccFeeIndex = BigInt.fromString(event.params.accFeeIndex.toString())
      Pool.lastFeeIndex = BigInt.fromString(Pool.newAccFeeIndex.div(Pool.oldAccFeeIndex).toString())
    }
    //in same block, keep updating the newFee, because the newFee turns into the oldFee when the block finishes
    else if (event.block.number == Pool.blockNumber) {
      Pool.newAccFeeIndex = BigInt.fromString(event.params.accFeeIndex.toString())
      Pool.lastFeeIndex = BigInt.fromString(Pool.newAccFeeIndex.div(Pool.oldAccFeeIndex).toString())
    }
    //in new blocks, the value of oldFee is set to newFee and newFee gets the new event value
    else if (event.block.number > Pool.blockNumber) {
      Pool.blockNumber = event.block.number
      Pool.oldAccFeeIndex = Pool.newAccFeeIndex
      Pool.newAccFeeIndex = BigInt.fromString(event.params.accFeeIndex.toString())
      Pool.lastFeeIndex = BigInt.fromString(Pool.newAccFeeIndex.div(Pool.oldAccFeeIndex).toString())
    }

    Pool.save()
  }


  poolData.address = event.address // the gammaPool contract address
  poolData.lpTokenBalance = BigInt.fromString(event.params.lpTokenBalance.toString())
  poolData.lpTokenBorrowed = BigInt.fromString(event.params.lpTokenBorrowed.toString())
  poolData.lpTokenBorrowedPlusInterest = BigInt.fromString(event.params.lpTokenBorrowedPlusInterest.toString())
  poolData.lpTokenTotal = BigInt.fromString(poolData.lpTokenBalance.plus(poolData.lpTokenBorrowedPlusInterest).toString())
  poolData.lpInvariant = BigInt.fromString(event.params.lpInvariant.toString())
  poolData.lpBorrowedInvariant = BigInt.fromString(event.params.lpBorrowedInvariant.toString())
  poolData.lpTotalInvariant = BigInt.fromString(poolData.lpInvariant.plus(poolData.lpBorrowedInvariant).toString())
  poolData.lpUtilizationRate = BigDecimal.fromString(poolData.lpBorrowedInvariant.toBigDecimal().div(poolData.lpTotalInvariant.toBigDecimal()).toString())
  poolData.lastBlockNumber = event.params.lastBlockNumber
  poolData.lastFeeIndex = BigInt.fromString(event.params.lastFeeIndex.toString())
  poolData.newAccFeeIndex = BigInt.fromString(event.params.accFeeIndex.toString())
  poolData.blockNumber = event.block.number

  poolData.price = new BigInt(10) // dummy price: CFMM_RESERVES[1] / CFMM_RESERVES[0] 
  poolData.suppliedLiquidity = BigInt.fromString( //2 * TOTAL_INVARIANT * sqrt(price)
    (new BigInt(2))
      .times(poolData.lpTotalInvariant)
      .times(poolData.price.sqrt())
      .toString())

  poolData.borrowedLiquidity = BigInt.fromString( //2 * BORROWED_INVARIANT * sqrt(price)
    (new BigInt(2))
      .times(poolData.lpBorrowedInvariant)
      .times(poolData.price.sqrt())
      .toString())

  //poolData.totalCollateral = 

  //poolData.tokenBalance[0] = (lpTokenBalance/totalLpTokens)*(token0_reserves/token1_reserves)

  poolData.save()
}

export function handleLoanUpdated(event: LoanUpdated): void {
  let loanData = new LoanDataSchema(event.transaction.hash.toHex())
  //MISSING: poolID, heldLiquidity
  loanData.tokensHeld = [BigInt.fromString(event.params.tokensHeld[0].toString()), BigInt.fromString(event.params.tokensHeld[1].toString())];
  loanData.liquidity = BigInt.fromString(event.params.liquidity.toString())
  loanData.lpTokens = BigInt.fromString(event.params.lpTokens.toString())
  loanData.rateIndex = BigInt.fromString(event.params.rateIndex.toString())
  loanData.collateral = BigInt.fromString(
    (loanData.tokensHeld[0]
      .times(loanData.tokensHeld[1]))
      .sqrt()
      .toString())

  loanData.loanToValue = BigDecimal.fromString(
    new BigDecimal(loanData.liquidity)
      .div(new BigDecimal(loanData.collateral))
      .toString())
  loanData.blockNumber = event.block.number
  loanData.save()
}