import { Deposit as DepositEvent } from "../../generated/templates/GammaPool/GammaPool"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ZERO_BI, TransactionType } from "../constants"
import { getOrCreateLiquidityPosition } from "../functions/liquidity-position"
import { createLiquidityPositionSnapshot } from "../functions/liquidity-position-snapshot"
import { getOrCreateUser } from "../functions/user"
import {
  Pool as PoolEntity,
  LiquidityPosition as LiquidityPositionEntity,
  User as UserEntity,
  Transaction as TransactionEntity,
} from "../../generated/schema"

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

export function LPIntoPool(event: DepositEvent, user: UserEntity, pool: PoolEntity): LiquidityPositionEntity {
  let txID = user.id.concat("-").concat(event.transaction.hash.toHexString()).concat("-").concat(event.logIndex.toHexString())
  let transaction = new TransactionEntity(txID)
  transaction.txhash = event.transaction.hash
  transaction.pool = pool.id
  transaction.type = TransactionType.DEPOSIT_RESERVES
  transaction.from = getOrCreateUser(event.transaction.from).id
  if (event.transaction.to) {
    transaction.to = getOrCreateUser(event.transaction.to as Address).id
  }
  transaction.block = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.txIndexInBlock = event.transaction.index
  transaction.save()

  // handle creation and update of user's liquidity position & snapshot
  let position = getOrCreateLiquidityPosition(event, pool, user, transaction.type)
  createLiquidityPositionSnapshot(position, transaction)
  
  // update token balances and data
  // check if position is closed
  
  position.save()

  return position as LiquidityPositionEntity
}

// export function borrowFromPool() {}
// export function updatePool() {}