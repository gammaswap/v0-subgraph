import { LoanUpdated, PoolUpdated, LoanCreated } from '../../generated/GammaPoolFactory/GammaPool'
import { Deposit as DepositEvent } from '../../generated/templates/GammaPool/GammaPool'
import { handleDeposit } from '../deposit'
import { getOrCreateLiquidityPosition } from '../functions/liquidity-position'
import { createLiquidityPositionSnapshot } from '../functions/liquidity-position-snapshot'

export function onDeposit(event: DepositEvent): void {
  let deposit = handleDeposit(event)
  if (deposit !== null) {    
    // handle creation and update of user's liquidity position & snapshot
    let position = getOrCreateLiquidityPosition(event.params.to, event.address, event.block)
    position.liquidityBalance = position.liquidityBalance.plus(event.params.shares)
    position.save()
    createLiquidityPositionSnapshot(position, event.block)

    // updating usage metrics and global GammaSwap data
    // updateGammaswapDayData(event)
    // updatePoolDayData(event)
    // updatePoolHourData(event)
    // updateTokenDayData(token0 as TokenEntity, event)
    // updateTokenDayData(token1 as TokenEntity, event)  
  }
}

export function handlePoolUpdated(event: PoolUpdated): void {}
export function handleLoanCreated(event: LoanCreated): void {}
export function handleLoanUpdated(event: LoanUpdated): void {}



