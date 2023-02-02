import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { GSFactory, Pool as PoolCreatedSchema, Token } from '../../generated/schema'
import { Address, BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { GAMMAPOOL_FACTORY_ADDRESS, ZERO_BD, ZERO_BI } from './helpers'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  loadOrCreateFactory(event)
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.implementationID = event.params.protocolId
  poolCreated.implementation = event.params.implementation
  poolCreated.symbol = ""
  poolCreated.name = ""
  poolCreated.tokens = []
  poolCreated.txCount = 0
  poolCreated.createdAtTimestamp = event.block.timestamp
  poolCreated.createdAtBlock = event.block.number
  poolCreated.lpTokenBalance = ZERO_BI
  poolCreated.lpTokenBorrowed = ZERO_BI
  poolCreated.lpTokenBorrowedPlusInterest = ZERO_BI
  poolCreated.accFeeIndex = ZERO_BI
  poolCreated.lpInvariant = ZERO_BI
  poolCreated.borrowedInvariant = ZERO_BI

  // instantiate gamma pool template
  GammaPool.create(event.params.pool)
  poolCreated.save()
}

function loadOrCreateFactory(event: PoolCreated): string | null {
  let factory = GSFactory.load(GAMMAPOOL_FACTORY_ADDRESS) // load in current addresses if its already init
  let newFactory: boolean = false;

  if (factory === null) { // init entity and make it have the pool that was just emitted by the event
    factory = new GSFactory(GAMMAPOOL_FACTORY_ADDRESS)
    newFactory = true
  }
  factory.totalVolumeUSD = ZERO_BD
  factory.totalVolumeETH = ZERO_BD
  factory.totalLiquidityUSD = ZERO_BD
  factory.totalLiquidityETH = ZERO_BD
  factory.totalSuppliedUSD = ZERO_BD
  factory.totalSuppliedETH = ZERO_BD
  factory.totalBorrowedUSD = ZERO_BD
  factory.totalBorrowedETH = ZERO_BD
  factory.totalCollateralUSD = ZERO_BD
  factory.totalCollateralETH = ZERO_BD
  factory.txCount = ZERO_BI
  if (newFactory) factory.poolCount = 1
  else factory.poolCount = factory.poolCount + 1

  return event.params.pool.toHexString()
}
