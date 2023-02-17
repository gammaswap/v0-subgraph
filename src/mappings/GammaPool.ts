import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { Deposit as DepositEvent } from '../../generated/templates/GammaPool/GammaPool'
import { Address, log } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS } from '../constants'
import { getOrCreateUser } from '../functions/user'
import { getOrCreateERC20Token } from '../functions/token'
import { LPIntoPool } from './helpers'
import {
  GSFactory as GSFactoryEntity,
  Pool as PoolEntity,
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
  let gammaswap = GSFactoryEntity.load(FACTORY_ADDRESS) as GSFactoryEntity

  // update token balances and data
  let token0 = getOrCreateERC20Token(event, Address.fromString(pool.tokens[0]))
  let token1 = getOrCreateERC20Token(event, Address.fromString(pool.tokens[1]))

  // update txn counts
  token0.txCount = token0.txCount + 1
  token1.txCount = token1.txCount + 1
  pool.txCount = pool.txCount + 1
  gammaswap.txCount = gammaswap.txCount + 1

  token0.save()
  token1.save()
  pool.save()
  gammaswap.save()

  LPIntoPool(event, user, pool)
}

// MAIN EVENT HANDLERS

export function handleDeposit(event: DepositEvent): void {
  let pool = PoolEntity.load(event.address.toHexString()) as PoolEntity
  let deposit = getOrCreateDeposit(event, pool)
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.save()

  createOrUpdatePositionOnDeposit(event, pool, deposit)
  // updating usage metrics and global GammaSwap data
  // updateGammaswapDayData(event)
  // updatePoolDayData(event)
  // updatePoolHourData(event)
  // updateTokenDayData(token0 as TokenEntity, event)
  // updateTokenDayData(token1 as TokenEntity, event)
}

export function handlePoolUpdated(event: PoolUpdated): void {}
export function handleLoanCreated(event: LoanCreated): void {}
export function handleLoanUpdated(event: LoanUpdated): void {}



