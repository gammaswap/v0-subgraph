import { Deposit as DepositEvent } from "../generated/templates/GammaPool/GammaPool"
import { getOrCreateToken } from "./functions/token"
import { FACTORY_ADDRESS } from "./constants"
import {
  Pool as PoolEntity,
  GSFactory as GSFactoryEntity,
  Deposit as DepositEntity,
  Transaction as TransactionEntity,
} from "../generated/schema"

export function handleDeposit(event: DepositEvent): DepositEntity | null {
  let transaction = TransactionEntity.load(event.transaction.hash.toHexString())
  if (transaction == null) return null
  
  let deposits = transaction.deposits
  let deposit = DepositEntity.load(deposits[deposits.length - 1]) as DepositEntity
  deposit.caller = event.params.caller
 
  const pool = PoolEntity.load(event.address.toHexString()) as PoolEntity
  const gammaswap = GSFactoryEntity.load(FACTORY_ADDRESS) as GSFactoryEntity

  // update token balances and data
  let token0 = getOrCreateToken(pool.tokens[0])
  let token1 = getOrCreateToken(pool.tokens[1])


  // update txn counts
  token0.txCount = token0.txCount + 1
  token1.txCount = token1.txCount + 1
  pool.txCount = pool.txCount + 1
  gammaswap.txCount = gammaswap.txCount + 1

  deposit.save()
  token0.save()
  token1.save()
  pool.save()
  gammaswap.save()

  return deposit
}