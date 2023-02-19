import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool as GammaPoolTemplate } from '../../generated/templates'
import { Pool as PoolEntity } from '../../generated/schema'
import { ZERO_BI } from "../constants"
import { getPoolTokens, generatePoolSymbol, generatePoolName } from "../functions/pool"
import { getOrCreateFactory } from '../functions/factory'

export function handlePoolCreated(event: PoolCreated): void {
  let factory = getOrCreateFactory()

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

