import { Deposit as DepositEvent } from "../generated/templates/GammaPool/GammaPool"
import { getOrCreateDeposit } from "./functions/deposit"
import { getOrCreateToken } from "./functions/token"
import { FACTORY_ADDRESS } from "./constants"
import { createTransaction } from "./functions/transaction"
import {
  Pool as PoolEntity,
  GSFactory as GSFactoryEntity,
  Deposit as DepositEntity
} from "../generated/schema"
import { getTokenPrice } from "./functions/token-price"

export function handleDeposit(event: DepositEvent): DepositEntity {
  let transaction = createTransaction(event)
  let pool = PoolEntity.load(event.address.toHexString()) as PoolEntity

  // create deposit
  let deposit = getOrCreateDeposit(event, pool)
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.save()

  let gammaswap = GSFactoryEntity.load(FACTORY_ADDRESS) as GSFactoryEntity

  // update token balances and data
  let token0 = getOrCreateToken(pool.tokens[0])
  let token1 = getOrCreateToken(pool.tokens[1])
  let token0Price = getTokenPrice(pool.tokens[0])
  let token1Price = getTokenPrice(pool.tokens[1])

  // get token amounts from deposit - assets

  // update txn counts
  token0.txCount = token0.txCount + 1
  token1.txCount = token1.txCount + 1
  pool.txCount = pool.txCount + 1
  gammaswap.txCount = gammaswap.txCount + 1

  token0.save()
  token1.save()
  pool.save()
  gammaswap.save()

  // get tokens and their prices
  // get amount of assets and get their total amounts in USD
  // asset0Price = getAssetPrice(asset0)
  // asset1Price = getAssetPrice(asset1)
  // asset0AmountUSD = asset0Amount * asset0Price
  // asset1AmountUSD = asset1Amount * asset1Price
  // totalAmountUSD = asset0AmountUSD + asset1AmountUSD

  // getOrCreateDeposit(event, pool)

  // add txCount to pool, tokens, and gammaswap
  return deposit
}