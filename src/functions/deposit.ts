import { Transfer as TransferEvent } from "../../generated/templates/GammaPool/GammaPool"
import { Deposit as DepositEntity } from "../../generated/schema"
import { getOrCreateUser } from "../functions/user"
import { BigInt } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "../constants"

export function getOrCreateDeposit(event: TransferEvent, depositCount: i32): DepositEntity {
  let depositId = event.transaction.hash.toHexString()
  .concat("-")
  .concat(BigInt.fromI32(depositCount).toString())

  let deposit = DepositEntity.load(depositId)
  if (deposit === null) {
    deposit = new DepositEntity(depositId)
    deposit.pool = event.address.toHexString()
    deposit.to = getOrCreateUser(event.params.to).id
    deposit.shares = event.params.amount
    deposit.caller = ADDRESS_ZERO
    deposit.block = event.block.number
    deposit.timestamp = event.block.timestamp
    deposit.save()
  }


  return deposit as DepositEntity
}