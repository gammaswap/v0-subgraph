import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { GSFactory, Pool as PoolCreatedSchema, Token } from '../../generated/schema'
import { Address, BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { FactoryAddress, ZERO_BI } from './helpers'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  loadOrCreateFactory(event)
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
  poolCreated.implementation = event.params.implementation
  poolCreated.symbol = ''
  poolCreated.name = ''
  poolCreated.tokens = ['']
  poolCreated.txCount = 0
  poolCreated.createdAtTimestamp = event.block.timestamp
  poolCreated.createdAtBlock = event.block.number
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
}

function loadOrCreateFactory(event: PoolCreated): string | null {
  let factory = GSFactory.load(FactoryAddress) // load in current addresses if its already init
  if (factory === null) { // init entity and make it have the pool that was just emitted by the event
    factory = new GSFactory(FactoryAddress)
  }
  factory.totalBorrowed = ZERO_BI
  factory.totalCollateral = ZERO_BI
  factory.totalSupplied = ZERO_BI
  factory.save()

  return event.params.pool.toHexString()
}
