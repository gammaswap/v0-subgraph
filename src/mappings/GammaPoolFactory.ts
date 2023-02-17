import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool as GammaPoolTemplate } from '../../generated/templates'
import { GSFactory, Pool as PoolEntity } from '../../generated/schema'
import { FACTORY_ADDRESS, ZERO_BD, ZERO_BI } from "../constants"
import { getPoolTokens, generatePoolSymbol, generatePoolName } from "../functions/pool"

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
    factory.txCount = 0
    factory.poolCount = 0
  }

  factory.poolCount = factory.poolCount + 1
  factory.save()

  // create or load the token
  const tokens = getPoolTokens(event)
  const symbol = generatePoolSymbol(tokens)
  const name = generatePoolName(event.params.protocolId)

  const pool = new PoolEntity(event.params.pool.toHexString())
  // pool metadata
  pool.address = event.params.pool
  pool.name = name
  pool.symbol = symbol
  pool.cfmm = event.params.cfmm
  pool.implementation = event.params.implementation
  pool.implementationID = event.params.protocolId
  pool.tokens = [tokens[0].id, tokens[1].id]
  
  // raw data to calculate usage metrics
  pool.lpTokenBalance = ZERO_BI
  pool.lpTokenBorrowed = ZERO_BI
  pool.lpTokenBorrowedPlusInterest = ZERO_BI
  pool.accFeeIndex = ZERO_BI
  pool.lpInvariant = ZERO_BI
  pool.borrowedInvariant = ZERO_BI
  
  pool.createdAtBlock = event.block.number
  pool.createdAtTimestamp = event.block.timestamp
  pool.txCount = 0

  // instantiate gamma pool template
  GammaPoolTemplate.create(event.params.pool)
  pool.save()
}

