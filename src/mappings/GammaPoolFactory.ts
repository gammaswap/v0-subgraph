import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { GSFactory, Pool as PoolCreatedSchema, Token } from '../../generated/schema'
import { Address, BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { ZERO_BI } from './helpers'
import { EthersEvent } from 'alchemy-sdk/dist/src/internal/ethers-event'

export function handlePoolCreated(event: PoolCreated): void {
  // creates new pool instance 
  loadOrCreateFactory(event)
  //getOrCreateERC20Token(event, event.params.tokens[0])
  //getOrCreateERC20Token(event, event.params.tokens[1])
  const poolCreated = new PoolCreatedSchema(event.params.pool.toHexString())

  poolCreated.address = event.params.pool
  poolCreated.cfmm = event.params.cfmm
  poolCreated.protocolId = BigInt.fromString(event.params.protocolId.toString())
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
}

function loadOrCreateFactory(event: PoolCreated): string | null {
  let overview = GSFactory.load('1') // load in current addresses if its already init
  if (overview === null) { // init entity and make it have the pool that was just emitted by the event
    overview = new GSFactory('1')
    overview.createdPools = [event.params.pool]
  }
  else overview.createdPools = overview.createdPools.concat([event.params.pool]) //if already init, append new address
  overview.totalBorrowed = ZERO_BI
  overview.totalCollateral = ZERO_BI
  overview.totalSupplied = ZERO_BI
  overview.save()

  return event.params.pool.toHexString()
}

/*
function getOrCreateERC20Token(event: ethereum.Event, address: Address): Token {
  let token = Token.load(address.toHexString())
  if (!token) token = new Token(address.toHexString())

  //not sure how to get correct decimals, uniswap v2 does it manually it seems?
  //token.decimals = BigInt.fromI32(18)

  //total supply: ZERO_BI
  //total liquidity: ZERO_BI
  //trade volume: ZERO_BI

  //lastpriceUSD: ZERO_BI
  //lastpiriceBlock: ZERO_BI
  //tx count: ZERO_BI
  return token
}
*/
