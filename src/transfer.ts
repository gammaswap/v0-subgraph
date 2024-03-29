import { Transfer as TransferEvent } from "../generated/templates/GammaPool/GammaPool"
import { Deposit as DepositEntity } from "../generated/schema"
import { ADDRESS_ZERO } from "./constants"
import { getOrCreateTransaction } from "./functions/transaction"
import { BigInt, log } from "@graphprotocol/graph-ts"
import { getOrCreateDeposit } from "./functions/deposit"
import { getOrCreateLiquidityPosition } from "./functions/liquidity-position"
import { createLiquidityPositionSnapshot } from "./functions/liquidity-position-snapshot"

function isInitialTransfer(event: TransferEvent): boolean {
  return event.params.to == ADDRESS_ZERO && event.params.amount == BigInt.fromI32(1000)
}

function isDeposit(event: TransferEvent): boolean {
  return event.params.from == ADDRESS_ZERO
}

function isCompleteDeposit(depositId: string): boolean {
  const deposit = DepositEntity.load(depositId)
  return !deposit || deposit.caller !== null
}

export function handleTransfer(event: TransferEvent): void {
  if (isInitialTransfer(event)) return

  // get or create transaction
  const transaction = getOrCreateTransaction(event)
  const deposits = transaction.deposits

  // check if transfer event is a deposit
  if (isDeposit(event)) {
    // if so, create or get deposit entity and add to transaction
    // check if deposit completed and transaction deposit len is 0 before doing the above
    log.warning("Deposit detected by {} of {} units", [event.params.to.toHexString(), event.params.amount.toString()])
    if (transaction.deposits.length === 0 || isCompleteDeposit(deposits[deposits.length - 1])) {
      const deposit = getOrCreateDeposit(event, deposits.length)
      deposit.transaction = transaction.id
      transaction.deposits = deposits.concat([deposit.id])

      deposit.save()
      transaction.save()
    }
  }

  transaction.save()
}

export function createLiquidityPositions(event: TransferEvent): void {
  if (isInitialTransfer(event)) return

  if (event.params.from != ADDRESS_ZERO && event.params.from != event.address) {
    const fromUserLiquidityPosition = getOrCreateLiquidityPosition(event.params.from, event.address, event.block)
    fromUserLiquidityPosition.liquidityBalance = fromUserLiquidityPosition.liquidityBalance.minus(event.params.amount)
    fromUserLiquidityPosition.save()
    createLiquidityPositionSnapshot(fromUserLiquidityPosition, event.block)
  }

  if (event.params.to != ADDRESS_ZERO && event.params.to != event.address) {
    const toUserLiquidityPosition = getOrCreateLiquidityPosition(event.params.to, event.address, event.block)
    toUserLiquidityPosition.liquidityBalance = toUserLiquidityPosition.liquidityBalance.plus(event.params.amount)
    toUserLiquidityPosition.save()
    createLiquidityPositionSnapshot(toUserLiquidityPosition, event.block)
  }
}