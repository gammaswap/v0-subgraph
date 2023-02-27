import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { Deposit as DepositEvent, Transfer as TransferEvent } from '../../generated/templates/GammaPool/GammaPool'
import { handleDeposit } from '../deposit'
import { createLiquidityPositions, handleTransfer } from '../transfer'
import { getOrCreateLiquidityPosition } from '../functions/liquidity-position'
import { createLiquidityPositionSnapshot } from '../functions/liquidity-position-snapshot'
import { getOrCreateUser } from '../functions/user'
import { updateFactorySnapshots } from '../functions/factory-snapshot'

export function onDeposit(event: DepositEvent): void {
  let deposit = handleDeposit(event)
  if (deposit !== null) {    
    // handle creation and update of user's liquidity position & snapshot
    let position = getOrCreateLiquidityPosition(event.params.to, event.address, event.block)
    updateFactorySnapshots(event)
    createLiquidityPositionSnapshot(position, event.block)
    // updateTokenSnapshots(event.block.timestamp, event.address)
    // updatePoolSnapshots(event.block.timestamp, event.address)
  }
}

export function onTransfer(event: TransferEvent): void {
  getOrCreateUser(event.params.from)
  getOrCreateUser(event.params.to)
  handleTransfer(event)
  createLiquidityPositions(event)
}

export function handlePoolUpdated(event: PoolUpdated): void {}
export function handleLoanCreated(event: LoanCreated): void {}
export function handleLoanUpdated(event: LoanUpdated): void {}



