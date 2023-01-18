import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { GammaSwapOverview as GammaSwapOverview } from '../../generated/schema'
import { BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { createdPoolsAndLoans as createdIDSchema } from '../../generated/schema'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())

  let created = createdIDSchema.load("CREATE")
  if (created === null) created = new createdIDSchema("CREATE")


  poolCreated.address = event.params.pool
  created.IDcreatedPools = created.IDcreatedPools.concat([event.params.pool])
  //created.IDcreatedPools = []
  created.IDcreatedLoans = []


  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
  //poolCreated.protocol = event.params.protocol
  poolCreated.tokenBalances = [BigInt.fromString('0'), BigInt.fromString('0')]

  poolCreated.count = event.params.count
  poolCreated.blockNumber = new BigInt(0)
  poolCreated.oldAccFeeIndex = new BigInt(0)
  poolCreated.newAccFeeIndex = new BigInt(0)
  poolCreated.lastFeeIndex = new BigDecimal(new BigInt(0))
  poolCreated.borrowedLiquidity = new BigInt(0)
  poolCreated.suppliedLiquidity = new BigInt(0)
  poolCreated.totalCollateral = new BigInt(0)


  // instantiate gamma pool template
  GammaPool.create(event.params.pool)

  poolCreated.save()
  created.save()
}