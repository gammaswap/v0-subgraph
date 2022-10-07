import { PoolCreated as PoolCreatedSchema } from '../../generated/schema'
import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { bigInt } from '@graphprotocol/graph-ts'

export function handlePoolCreated(event: PoolCreated): void {
  let poolCreated = PoolCreatedSchema.load(event.params.pool.toString())

  if (!poolCreated) {
    poolCreated = new PoolCreatedSchema(event.params.pool.toString())

    poolCreated.pool = event.params.pool
    poolCreated.cfmm = event.params.cfmm
    poolCreated.protocol = event.params.protocol
    poolCreated.protocolId = bigInt.fromString(event.params.protocolId.toString())
    poolCreated.count = event.params.count
  }

  poolCreated.save()
}
