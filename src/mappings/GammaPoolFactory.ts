import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  const poolCreated = new PoolCreatedSchema(event.transaction.hash.toHex())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
  poolCreated.protocol = event.params.protocol
  poolCreated.count = event.params.count

  // instantiate gamma pool template
  GammaPool.create(event.params.pool)

  poolCreated.save()
} 
