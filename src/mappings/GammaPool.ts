import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { Deposit as DepositEvent, GammaPool } from '../../generated/templates/GammaPool/GammaPool'
import { Address, ethereum, log } from '@graphprotocol/graph-ts'
import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { ZERO_BD, ZERO_BI } from '../constants'
import { getOrCreateUser, LPIntoPool } from "./helpers"
import {
  GSFactory,
  User as UserEntity,
  LiquidityPosition as LiquidityPositionEntity,
  Pool as PoolEntity,
  PoolSnapshot as PoolSnapshotEntity,
  Loan as LoanEntity,
  LoanSnapshot as LoanSnapshotEntity,
  Deposit as DepositEntity,
} from '../../generated/schema'

function getOrCreateDeposit(event: DepositEvent, pool: PoolEntity): DepositEntity {
  let depositId = pool.id.concat("-").concat(event.transaction.hash.toHexString())
  let deposit = DepositEntity.load(depositId)
  if (deposit != null) {
    return deposit as DepositEntity
  }

  deposit = new DepositEntity(depositId)
  deposit.pool = pool.id
  deposit.from = getOrCreateUser(event.params.caller).id
  deposit.to = getOrCreateUser(event.params.to).id
  deposit.block = event.block.number
  deposit.timestamp = event.block.timestamp
  deposit.save()

  return deposit as DepositEntity
}

function createOrUpdatePositionOnDeposit(event: DepositEvent, pool: PoolEntity, deposit: DepositEntity): void {
  let user = getOrCreateUser(event.params.to)

  // update token balances and data

  LPIntoPool(event, user, pool)

  // updating usage metrics and global GammaSwap data
  // updatePool()
}

// MAIN EVENT HANDLERS

export function handleDeposit(event: DepositEvent): void {
  let pool = PoolEntity.load(event.address.toHexString()) as PoolEntity
  let deposit = getOrCreateDeposit(event, pool)
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.save()

  createOrUpdatePositionOnDeposit(event, pool, deposit)
}

export function handlePoolUpdated(event: PoolUpdated): void {}
export function handleLoanCreated(event: LoanCreated): void {}
export function handleLoanUpdated(event: LoanUpdated): void {}



