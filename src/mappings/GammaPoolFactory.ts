import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool as GammaPoolTemplate } from '../../generated/templates'
import { GSFactory, Pool as PoolEntity, Token } from '../../generated/schema'
import { Address, BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS, ZERO_BD, ZERO_BI } from './helpers'

export function handlePoolCreated(event: PoolCreated): void {
  let factory = GSFactory.load(FACTORY_ADDRESS)

  if (factory === null) {
    factory = new GSFactory(FACTORY_ADDRESS)
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
    factory.poolCount = 0
  }

  factory.poolCount = factory.poolCount + 1
  factory.save()

  const pool = new PoolEntity(event.params.pool.toHexString())

  pool.address = event.params.pool
  pool.cfmm = event.params.cfmm
  pool.implementationID = event.params.protocolId
  pool.implementation = event.params.implementation
  pool.symbol = ""
  pool.name = ""
  pool.tokens = []
  pool.txCount = 0
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlock = event.block.number
  pool.lpTokenBalance = ZERO_BI
  pool.lpTokenBorrowed = ZERO_BI
  pool.lpTokenBorrowedPlusInterest = ZERO_BI
  pool.accFeeIndex = ZERO_BI
  pool.lpInvariant = ZERO_BI
  pool.borrowedInvariant = ZERO_BI

  // instantiate gamma pool template
  GammaPoolTemplate.create(event.params.pool)
  pool.save()
}

