import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { GammaSwapOverview as GammaSwapOverview } from '../../generated/schema'
import { BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { ZERO_BI } from './helpers'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())


  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
  //poolCreated.protocol = event.params.protocol
  poolCreated.tokenBalances = [BigInt.fromString('0'), BigInt.fromString('0')]

  poolCreated.count = event.params.count
  poolCreated.blockNumber = ZERO_BI
  poolCreated.oldAccFeeIndex = ZERO_BI
  poolCreated.newAccFeeIndex = ZERO_BI
  poolCreated.lastFeeIndex = new BigDecimal(ZERO_BI)
  poolCreated.borrowedLiquidity = ZERO_BI
  poolCreated.suppliedLiquidity = ZERO_BI
  poolCreated.totalCollateral = ZERO_BI


  // instantiate gamma pool template
  GammaPool.create(event.params.pool)
  poolCreated.save()
  handlePoolCreatedForOverview(event)
}

export function handlePoolCreatedForOverview(event: PoolCreated): void {
  let overview = GammaSwapOverview.load('1') // load in current addresses if its already init
  if (overview === null) { // init entity and make it have the pool that was just emitted by the event
    overview = new GammaSwapOverview('1')
    overview.createdPools = [event.params.pool]
  }
  else overview.createdPools = overview.createdPools.concat([event.params.pool]) //if already init, append new address
  overview.totalBorrowed = ZERO_BI
  overview.totalCollateral = ZERO_BI
  overview.totalSupplied = ZERO_BI
  overview.save()
}