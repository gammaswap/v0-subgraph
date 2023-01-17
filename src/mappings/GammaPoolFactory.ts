import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
  //poolCreated.protocol = event.params.protocol

  poolCreated.count = event.params.count
  poolCreated.blockNumber = new BigInt(0)
  poolCreated.oldAccFeeIndex = new BigInt(0)
  poolCreated.newAccFeeIndex = new BigInt(0)
  poolCreated.lastFeeIndex = new BigInt(0)


  // instantiate gamma pool template
  GammaPool.create(event.params.pool)

  poolCreated.save()
} 
