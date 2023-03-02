import { ethereum } from "@graphprotocol/graph-ts"
import {
  Transaction as TransactionEntity,
} from "../../generated/schema"

export function createTransaction(event: ethereum.Event): TransactionEntity {
  const id = event.transaction.hash.toHex()
  
  const transaction = new TransactionEntity(id)
  transaction.deposits = new Array<string>()
  transaction.createdAtblock = event.block.number
  transaction.createdAttimestamp = event.block.timestamp
  transaction.save()

  return transaction as TransactionEntity
}

export function getOrCreateTransaction(event: ethereum.Event): TransactionEntity {
  const id = event.transaction.hash.toHexString()
  let transaction = TransactionEntity.load(id)
  if (transaction == null) {
    transaction = createTransaction(event)
  }

  return transaction as TransactionEntity
}
