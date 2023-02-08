import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { GSFactory, PoolSnapshot as PoolSnapshotEntity } from '../../generated/schema'
import { LoanSnapshot as LoanSnapshotEntity } from '../../generated/schema'
import { Loan as LoanSchema } from '../../generated/schema'
import { Pool as PoolSchema } from '../../generated/schema'
import { GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { ZERO_BD, ZERO_BI } from './helpers'

export function handlePoolUpdated(event: PoolUpdated): void {
  // let poolData = new PoolDataSchema(event.transaction.hash.toHex())
  // let gammaPool = GammaPool.bind(event.address)
  // let Pool = PoolSchema.load(event.address.toHexString())
  // if (Pool) {
  //   initPoolData(poolData, Pool, event)
  //   initPool(Pool, poolData, event)
  // }
}
export function handleLoanUpdated(event: LoanUpdated): void {
  // let loanData = new LoanDataSchema(event.transaction.hash.toHex())
  // let loan = LoanSchema.load(event.params.tokenId.toString())
  // if (!loan) loan = new LoanSchema(event.params.tokenId.toString())
  // let pool = PoolSchema.load(event.address.toHexString())

  // if (pool) {
  //   loanData.tokensHeld = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
  //   loan.tokensHeld = [event.params.tokensHeld[0], event.params.tokensHeld[1]];
  //   pool.save()
  // }
  // initLoanData(loanData, loan, event)
  // initLoan(loan, event)
}

export function handleLoanCreated(event: LoanCreated): void {
//   let loan = new LoanSchema(event.params.tokenId.toString())
//   loan.tokenId = event.params.tokenId
//   loan.pool = event.address.toHexString()
//   loan.blockNumber = ZERO_BI
//   loan.liquidity = ZERO_BI
//   loan.lpTokens = ZERO_BI
//   loan.rateIndex = ZERO_BI
//   loan.collateral = ZERO_BI
//   loan.loanToValue = ZERO_BD
//   loan.blockNumber = ZERO_BI
//   loan.tokensHeld = [ZERO_BI, ZERO_BI]
//   loan.save()
}

// function initPoolData(poolData: PoolDataSchema, Pool: PoolSchema, event: PoolUpdated): void {
//   poolData.address = event.address // the gammaPool contract address
//   poolData.lpTokenBalance = event.params.lpTokenBalance
//   poolData.lpTokenBorrowed = event.params.lpTokenBorrowed
//   poolData.lpTokenBorrowedPlusInterest = event.params.lpTokenBorrowedPlusInterest
//   poolData.lpTokenTotal = BigInt.fromString(poolData.lpTokenBalance.plus(poolData.lpTokenBorrowedPlusInterest).toString())
//   poolData.lpInvariant = event.params.lpInvariant
//   poolData.borrowedInvariant = event.params.borrowedInvariant
//   poolData.lpTotalInvariant = BigInt.fromString(poolData.lpInvariant.plus(poolData.borrowedInvariant).toString())
//   poolData.lpUtilizationRate = BigDecimal.fromString(poolData.borrowedInvariant.toBigDecimal().div(poolData.lpTotalInvariant.toBigDecimal()).toString())
//   poolData.lastBlockNumber = event.params.lastBlockNumber
//   poolData.blockNumber = event.block.number

//   poolData.price = BigInt.fromI32(1) // dummy price: CFMM_RESERVES[1] / CFMM_RESERVES[0] 
//   poolData.suppliedLiquidity = BigInt.fromString( //2 * TOTAL_INVARIANT * sqrt(price)
//     BigInt.fromString('2')
//       .times(poolData.lpTotalInvariant)
//       .times(poolData.price.sqrt())
//       .toString())

//   poolData.borrowedLiquidity = BigInt.fromString( //2 * BORROWED_INVARIANT * sqrt(price)
//     BigInt.fromString('2')
//       .times(poolData.borrowedInvariant)
//       .times(poolData.price.sqrt())
//       .toString())
//   poolData.totalCollateral = BigInt.fromString( //TOKEN_BALANCE[0] * price + TOKEN_BALANCE[1]
//     Pool.tokenBalances[0]
//       .times(poolData.price)
//       .times(Pool.tokenBalances[1])
//       .toString())
//   poolData.save()
// }

// function initLoanData(loanData: LoanDataSchema, loan: LoanSchema, event: LoanUpdated): void {
//   loanData.tokenId = loan.tokenId
//   loanData.pool = loan.pool
//   loanData.liquidity = event.params.liquidity
//   loanData.lpTokens = event.params.lpTokens
//   loanData.rateIndex = event.params.rateIndex
//   loanData.collateral = BigInt.fromString(
//     (loanData.tokensHeld[0]
//       .times(loanData.tokensHeld[1]))
//       .sqrt()
//       .toString())

//   loanData.loanToValue = BigDecimal.fromString(
//     loanData.liquidity.toBigDecimal()
//       .div(loanData.collateral.toBigDecimal())
//       .toString())
//   loanData.blockNumber = event.block.number
//   loanData.save()
// }

// function initLoan(loan: LoanSchema, event: LoanUpdated): void {
//   loan.liquidity = event.params.liquidity
//   loan.lpTokens = event.params.lpTokens
//   loan.rateIndex = event.params.rateIndex
//   loan.collateral = BigInt.fromString(
//     (loan.tokensHeld[0]
//       .times(loan.tokensHeld[1]))
//       .sqrt()
//       .toString())

//   loan.loanToValue = BigDecimal.fromString(
//     loan.liquidity.toBigDecimal()
//       .div(loan.collateral.toBigDecimal())
//       .toString())
//   loan.blockNumber = event.block.number
//   loan.save()
// }

// function initPool(Pool: PoolSchema, poolData: PoolDataSchema, event: PoolUpdated): void {
//   //first time the poolData gets changed, since it gets initialized with blockNumber 0 on PoolCreation
//   if (Pool.blockNumber.toString() == "0") {
//     Pool.blockNumber = event.block.number
//     Pool.newAccFeeIndex = event.params.accFeeIndex
//     Pool.oldAccFeeIndex = event.params.accFeeIndex
//     Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
//   }
//   //in same block, keep updating the newFee, because the newFee turns into the oldFee when the block finishes
//   else if (event.block.number == Pool.blockNumber) {
//     Pool.newAccFeeIndex = event.params.accFeeIndex
//     Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
//   }
//   //in new blocks, the value of oldFee is set to newFee and newFee gets the new event value
//   else if (event.block.number > Pool.blockNumber) {
//     Pool.blockNumber = event.block.number
//     Pool.oldAccFeeIndex = Pool.newAccFeeIndex
//     Pool.newAccFeeIndex = event.params.accFeeIndex
//     Pool.lastFeeIndex = BigDecimal.fromString(Pool.newAccFeeIndex.toBigDecimal().div(Pool.oldAccFeeIndex.toBigDecimal()).toString())
//   }
//   Pool.save()
// }