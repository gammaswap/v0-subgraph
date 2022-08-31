import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BorrowLiquidity,
  CreateLoan,
  DecreaseCollateral,
  DepositNoPull,
  DepositReserves,
  IncreaseCollateral,
  RebalanceCollateral,
  RebalanceCollateralWithLiquidity,
  RepayLiquidity,
  Transfer,
  WithdrawNoPull,
  WithdrawReserves
} from "../generated/PositionManager/PositionManager"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBorrowLiquidityEvent(
  pool: Address,
  tokenId: BigInt,
  amountsLen: BigInt
): BorrowLiquidity {
  let borrowLiquidityEvent = changetype<BorrowLiquidity>(newMockEvent())

  borrowLiquidityEvent.parameters = new Array()

  borrowLiquidityEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  borrowLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amountsLen",
      ethereum.Value.fromUnsignedBigInt(amountsLen)
    )
  )

  return borrowLiquidityEvent
}

export function createCreateLoanEvent(
  pool: Address,
  tokenId: BigInt
): CreateLoan {
  let createLoanEvent = changetype<CreateLoan>(newMockEvent())

  createLoanEvent.parameters = new Array()

  createLoanEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  createLoanEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return createLoanEvent
}

export function createDecreaseCollateralEvent(
  pool: Address,
  tokenId: BigInt,
  tokensHeldLen: BigInt
): DecreaseCollateral {
  let decreaseCollateralEvent = changetype<DecreaseCollateral>(newMockEvent())

  decreaseCollateralEvent.parameters = new Array()

  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  decreaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokensHeldLen",
      ethereum.Value.fromUnsignedBigInt(tokensHeldLen)
    )
  )

  return decreaseCollateralEvent
}

export function createDepositNoPullEvent(
  pool: Address,
  shares: BigInt
): DepositNoPull {
  let depositNoPullEvent = changetype<DepositNoPull>(newMockEvent())

  depositNoPullEvent.parameters = new Array()

  depositNoPullEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  depositNoPullEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositNoPullEvent
}

export function createDepositReservesEvent(
  pool: Address,
  reservesLen: BigInt,
  shares: BigInt
): DepositReserves {
  let depositReservesEvent = changetype<DepositReserves>(newMockEvent())

  depositReservesEvent.parameters = new Array()

  depositReservesEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  depositReservesEvent.parameters.push(
    new ethereum.EventParam(
      "reservesLen",
      ethereum.Value.fromUnsignedBigInt(reservesLen)
    )
  )
  depositReservesEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositReservesEvent
}

export function createIncreaseCollateralEvent(
  pool: Address,
  tokenId: BigInt,
  tokensHeldLen: BigInt
): IncreaseCollateral {
  let increaseCollateralEvent = changetype<IncreaseCollateral>(newMockEvent())

  increaseCollateralEvent.parameters = new Array()

  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  increaseCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokensHeldLen",
      ethereum.Value.fromUnsignedBigInt(tokensHeldLen)
    )
  )

  return increaseCollateralEvent
}

export function createRebalanceCollateralEvent(
  pool: Address,
  tokenId: BigInt,
  tokensHeldLen: BigInt
): RebalanceCollateral {
  let rebalanceCollateralEvent = changetype<RebalanceCollateral>(newMockEvent())

  rebalanceCollateralEvent.parameters = new Array()

  rebalanceCollateralEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  rebalanceCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  rebalanceCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokensHeldLen",
      ethereum.Value.fromUnsignedBigInt(tokensHeldLen)
    )
  )

  return rebalanceCollateralEvent
}

export function createRebalanceCollateralWithLiquidityEvent(
  pool: Address,
  tokenId: BigInt,
  tokensHeldLen: BigInt
): RebalanceCollateralWithLiquidity {
  let rebalanceCollateralWithLiquidityEvent = changetype<
    RebalanceCollateralWithLiquidity
  >(newMockEvent())

  rebalanceCollateralWithLiquidityEvent.parameters = new Array()

  rebalanceCollateralWithLiquidityEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  rebalanceCollateralWithLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  rebalanceCollateralWithLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "tokensHeldLen",
      ethereum.Value.fromUnsignedBigInt(tokensHeldLen)
    )
  )

  return rebalanceCollateralWithLiquidityEvent
}

export function createRepayLiquidityEvent(
  pool: Address,
  tokenId: BigInt,
  liquidityPaid: BigInt,
  lpTokensPaid: BigInt,
  amountsLen: BigInt
): RepayLiquidity {
  let repayLiquidityEvent = changetype<RepayLiquidity>(newMockEvent())

  repayLiquidityEvent.parameters = new Array()

  repayLiquidityEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  repayLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  repayLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "liquidityPaid",
      ethereum.Value.fromUnsignedBigInt(liquidityPaid)
    )
  )
  repayLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "lpTokensPaid",
      ethereum.Value.fromUnsignedBigInt(lpTokensPaid)
    )
  )
  repayLiquidityEvent.parameters.push(
    new ethereum.EventParam(
      "amountsLen",
      ethereum.Value.fromUnsignedBigInt(amountsLen)
    )
  )

  return repayLiquidityEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWithdrawNoPullEvent(
  pool: Address,
  assets: BigInt
): WithdrawNoPull {
  let withdrawNoPullEvent = changetype<WithdrawNoPull>(newMockEvent())

  withdrawNoPullEvent.parameters = new Array()

  withdrawNoPullEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  withdrawNoPullEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )

  return withdrawNoPullEvent
}

export function createWithdrawReservesEvent(
  pool: Address,
  reservesLen: BigInt,
  assets: BigInt
): WithdrawReserves {
  let withdrawReservesEvent = changetype<WithdrawReserves>(newMockEvent())

  withdrawReservesEvent.parameters = new Array()

  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam(
      "reservesLen",
      ethereum.Value.fromUnsignedBigInt(reservesLen)
    )
  )
  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )

  return withdrawReservesEvent
}
