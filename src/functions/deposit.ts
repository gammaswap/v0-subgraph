import { Deposit as DepositEvent } from "../../generated/templates/GammaPool/GammaPool"
import { Pool as PoolEntity, Deposit as DepositEntity } from "../../generated/schema"
import { getOrCreateUser } from "../functions/user"

export function getOrCreateDeposit(event: DepositEvent, pool: PoolEntity): DepositEntity {
  let depositId = pool.id.concat("-").concat(event.transaction.hash.toHexString())
  let deposit = DepositEntity.load(depositId)
  if (deposit != null) {
    return deposit as DepositEntity
  }

  deposit = new DepositEntity(depositId)
  deposit.pool = pool.id
  deposit.from = getOrCreateUser(event.params.caller).id
  deposit.to = getOrCreateUser(event.params.to).id
  deposit.block = event.block.number
  deposit.timestamp = event.block.timestamp
  deposit.save()

  return deposit as DepositEntity
}