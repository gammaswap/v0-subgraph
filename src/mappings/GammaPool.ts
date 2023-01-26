import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { GSFactory, PoolData as PoolDataSchema } from '../../generated/schema'
import { LoanData as LoanDataSchema } from '../../generated/schema'
import { Loan as LoanSchema } from '../../generated/schema'
import { Pool as PoolSchema } from '../../generated/schema'
import { GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { ZERO_BD, ZERO_BI } from './helpers'



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
    Pool.suppliedLiquidity = poolData.suppliedLiquidity
    Pool.borrowedLiquidity = poolData.borrowedLiquidity
    Pool.totalCollateral = poolData.totalCollateral
    Pool.save()
  }

  poolData.save()
  handleGammaSwapOverview(event)
}

export function handleLoanUpdated(event: LoanUpdated): void {
  let loanData = new LoanDataSchema(event.transaction.hash.toHex())
  let loan = LoanSchema.load(event.params.tokenId.toString())
  if (!loan) loan = new LoanSchema(event.params.tokenId.toString())

  let pool = PoolSchema.load(event.address.toHexString())
  //MISSING: poolID, heldLiquidity
  if (pool) {
    //if (loan.blockNumber == ZERO_BI) pool.loans = pool.loans.concat([event.params.lpTokens])
    loanData.tokensHeld = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
    loan.tokensHeld = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
    pool.tokenBalances = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
    pool.save()
  }
  //loanData.poolAddress = loan.poolAddress
  loanData.tokenId = loan.tokenId
  loanData.pool = loan.pool
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

  loan.liquidity = event.params.liquidity
  loan.lpTokens = event.params.lpTokens
  loan.rateIndex = event.params.rateIndex
  loan.collateral = BigInt.fromString(
    (loan.tokensHeld[0]
      .times(loan.tokensHeld[1]))
      .sqrt()
      .toString())

  loan.loanToValue = BigDecimal.fromString(
    loan.liquidity.toBigDecimal()
      .div(loan.collateral.toBigDecimal())
      .toString())
  loan.blockNumber = event.block.number
  loan.save()

}
export function handleLoanCreated(event: LoanCreated): void {

  let loan = new LoanSchema(event.params.tokenId.toString())
  loan.tokenId = event.params.tokenId
  loan.pool = event.address.toHexString()
  loan.blockNumber = ZERO_BI
  loan.liquidity = ZERO_BI
  loan.lpTokens = ZERO_BI
  loan.rateIndex = ZERO_BI
  loan.collateral = ZERO_BI
  loan.loanToValue = ZERO_BD
  loan.blockNumber = ZERO_BI
  loan.tokensHeld = [ZERO_BI, ZERO_BI]

  loan.save()
}

export function handleGammaSwapOverview(event: PoolUpdated): void {
  let overview = GSFactory.load('1')
  if (overview === null) overview = new GSFactory('1')
  let borrowed: BigInt = ZERO_BI
  let supplied: BigInt = ZERO_BI
  let collateral: BigInt = ZERO_BI
  if (overview) {
    let length = overview.createdPools.length
    for (let i = 0; i < length; i++) {
      let pool = PoolSchema.load(overview.createdPools[i].toHexString())
      if (pool) {
        borrowed = borrowed.plus(pool.borrowedLiquidity)
        supplied = supplied.plus(pool.suppliedLiquidity)
        collateral = collateral.plus(pool.totalCollateral)
      }
    }
    overview.totalBorrowed = BigInt.fromString(borrowed.toString())
    overview.totalSupplied = BigInt.fromString(supplied.toString())
    overview.totalCollateral = BigInt.fromString(collateral.toString())
    overview.save()
  }
}

