import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { Deposit, GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { ZERO_BD, ZERO_BI } from '../constants'
import { getOrCreateUser } from "./helpers"
import {
  GSFactory,
  LiquidityPosition,
  Pool as PoolEntity,
  PoolSnapshot as PoolSnapshotEntity,
  Loan as LoanEntity,
  LoanSnapshot as LoanSnapshotEntity,
  Deposit as DepositEntity,
  LiquidityPositionSnapshot
} from '../../generated/schema'

export function handleDeposit(event: Deposit): void {
  let deposit = new DepositEntity(event.transaction.hash.toHexString())
  let pool = PoolEntity.load(event.address.toHexString()) as PoolEntity
  let user = getOrCreateUser(event.params.to)

  deposit.user = user.id
  deposit.pool = pool.id
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.block = event.block.number
  deposit.timestamp = event.block.timestamp
  deposit.save()

  // handle creation and update of user's liquidity position & snapshot
  let userLiquidityPosition = getOrCreateLiquidityPosition(pool, event.params.to)
  createLiquidityPositionSnapshot(userLiquidityPosition, event)

  // updating usage metrics and global GammaSwap data
}

function getOrCreateLiquidityPosition(pool: PoolEntity, userAddress: Address): LiquidityPosition {
  let id = pool.id.concat("-").concat(userAddress.toHexString())
  let position = LiquidityPosition.load(id)
  if (position != null) {
    return position as LiquidityPosition
  }

  position = new LiquidityPosition(id)
  position.pool = pool.id
  position.user = getOrCreateUser(userAddress).id
  position.save()
  return position as LiquidityPosition
}

function createLiquidityPositionSnapshot(position: LiquidityPosition, event: ethereum.Event): void {
  let timestamp = event.block.timestamp.toI32()
  let id = position.id.concat("-").concat(timestamp.toString())
  let pool = PoolEntity.load(position.pool)

  let snapshot = new LiquidityPositionSnapshot(id)
  snapshot.position = position.id
  snapshot.user = position.user
  snapshot.pool = position.pool
  snapshot.timestamp = timestamp
  snapshot.block = event.block.number.toI32()

  snapshot.save()
}
