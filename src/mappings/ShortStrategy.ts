import { Deposit, Transfer, Withdraw } from '../../generated/templates/ShortStrategy/ShortStrategy'

import { Deposit as DepositSchema, Transfer as TransferSchema, Withdraw as WithdrawSchema } from '../../generated/schema'

export function handleDeposit(event: Deposit): void {
  let deposit = DepositSchema.load(event.params._event.transaction.hash.toString())

  if (!deposit) {
    deposit = new DepositSchema(event.params._event.transaction.hash.toString())
    deposit.assets = event.params.assets
    deposit.caller = event.params.caller
    deposit.from = event.params.from
    deposit.shares = event.params.shares
  }

  deposit.save()
}

export function handleTransfer(event: Transfer): void {
  let transfer = TransferSchema.load(event.params._event.transaction.hash.toString())

  if (!transfer) {
    transfer = new TransferSchema(event.params._event.transaction.hash.toString())

    transfer.from = event.params.from
    transfer.to = event.params.to
    transfer.value = event.params.value
  }

  transfer.save()
}

export function handleWithdraw(event: Withdraw): void {
  let withdraw = WithdrawSchema.load(event.params._event.transaction.hash.toString())

  if (!withdraw) {
    withdraw = new WithdrawSchema(event.params._event.transaction.hash.toString())

    withdraw.assets = event.params.assets
    withdraw.caller = event.params.caller
    withdraw.to = event.params.to
    withdraw.from = event.params.from
    withdraw.shares = event.params.shares
  }

  withdraw.save()
}
