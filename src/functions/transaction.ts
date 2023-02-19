import { Address, ethereum } from "@graphprotocol/graph-ts"
import { TransactionType } from "../constants"
import { getOrCreateUser } from "../functions/user"
import {
  Transaction as TransactionEntity,
} from "../../generated/schema"

export function createTransaction(event: ethereum.Event): TransactionEntity {
  let txID = event.transaction.hash.toHex()
  
  let transaction = new TransactionEntity(txID)
  transaction.txhash = event.transaction.hash
  transaction.pool = event.address.toHexString()
  transaction.type = TransactionType.DEPOSIT_RESERVES
  transaction.from = getOrCreateUser(event.transaction.from).id
  if (event.transaction.to) {
    transaction.to = getOrCreateUser(event.transaction.to as Address).id
  }
  transaction.block = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.txIndexInBlock = event.transaction.index
  transaction.save()

  return transaction as TransactionEntity
}
