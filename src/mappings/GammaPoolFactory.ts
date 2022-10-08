import { PoolCreated, GammaPoolFactory } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool as GammaPoolContract } from '../../generated/GammaPoolFactory/GammaPool'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { Address, log } from '@graphprotocol/graph-ts'
import { BigInt, Bytes, ByteArray, crypto, ethereum, bigInt } from '@graphprotocol/graph-ts'
import { ONE_BI, SIX_BI } from './helpers'

function loadOrCreatePool(id: string): PoolCreatedSchema {
  const pool = PoolCreatedSchema.load(id)
  if (pool) return pool

  return new PoolCreatedSchema(id)
}

export function handlePoolCreated(event: PoolCreated): void {

  let gammaPool = GammaPoolContract.bind(event.params.pool)

  // loads event details into 
  const poolCreated = loadOrCreatePool(event.transaction.hash.toHex())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = bigInt.fromString(event.params.protocolId.toString())
  poolCreated.protocol = event.params.protocol
  poolCreated.count = event.params.count
  poolCreated.tokenBalances = [ONE_BI, SIX_BI]
  poolCreated.lpTokenBalance = ONE_BI
  poolCreated.lpTokenBorrowed = ONE_BI
  poolCreated.lpTokenBorrowedPlusInterest = ONE_BI
  poolCreated.lpTokenTotal = ONE_BI
  poolCreated.borrowRate = ONE_BI
  poolCreated.accFeeIndex = ONE_BI
  poolCreated.lastFeeIndex = ONE_BI
  poolCreated.lastCFMMFeeIndex = ONE_BI
  poolCreated.lastCFMMInvariant = ONE_BI
  poolCreated.lastCFMMTotalSupply = ONE_BI
  poolCreated.lastBlockNumber = ONE_BI
  poolCreated.totalSupply = ONE_BI

  poolCreated.save()
}

// handlePoolUpdated()
