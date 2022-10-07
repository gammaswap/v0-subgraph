import {
  CreateLoan,
  RebalanceCollateral,
  DepositNoPull,
  WithdrawNoPull,
  DepositReserves,
  WithdrawReserves,
  BorrowLiquidity,
  RepayLiquidity,
  IncreaseCollateral,
  DecreaseCollateral,
  RebalanceCollateralWithLiquidity,
} from '../../generated/PositionManager/PositionManager'
import {
  Loan,
  RebalanceCollateral as RebalanceCollateralSchema,
  DepositNoPull as DepositNoPullSchema,
  WithdrawNoPull as WithdrawNoPullSchema,
  DepositReserves as DepositReservesSchema,
  WithdrawReserves as WithdrawReservesSchema,
  BorrowLiquidity as BorrowLiquiditySchema,
  RepayLiquidity as RepayLiquiditySchema,
  IncreaseCollateral as IncreaseCollateralSchema,
  DecreaseCollateral as DecreaseCollateralSchema,
  RebalanceCollateralWithLiquidity as RebalanceCollateralWithLiquiditySchema,
} from '../../generated/schema'

export function handleCreateLoan(event: CreateLoan): void {
  let loan = Loan.load(event.params.tokenId.toString())

  if (!loan) {
    loan = new Loan(event.params.tokenId.toString())
    loan.pool = event.params.pool
    loan.tokenId = event.params.tokenId
  }

  loan.save()
}

export function handleRebalanceCollateral(event: RebalanceCollateral): void {
  let rebalanceCollateral = RebalanceCollateralSchema.load(event.params.tokenId.toString())

  if (!rebalanceCollateral) {
    rebalanceCollateral = new RebalanceCollateralSchema(event.params.tokenId.toString())
    rebalanceCollateral.pool = event.params.pool
    rebalanceCollateral.tokenId = event.params.tokenId
    rebalanceCollateral.tokensHeldLen = event.params.tokensHeldLen
  }

  rebalanceCollateral.save()
}

export function handleDepositNoPull(event: DepositNoPull): void {
  let depositNoPull = DepositNoPullSchema.load(event.params.pool.toString())

  if (!depositNoPull) {
    depositNoPull = new DepositNoPullSchema(event.params.pool.toString())
    depositNoPull.pool = event.params.pool
    depositNoPull.shares = event.params.shares
  }

  depositNoPull.save()
}

export function handleWithdrawNoPull(event: WithdrawNoPull): void {
  let withdrawNoPull = WithdrawNoPullSchema.load(event.params.pool.toString())

  if (!withdrawNoPull) {
    withdrawNoPull = new WithdrawNoPullSchema(event.params.pool.toString())
    withdrawNoPull.pool = event.params.pool
    withdrawNoPull.assets = event.params.assets
  }

  withdrawNoPull.save()
}

export function handleDepositReserves(event: DepositReserves): void {
  let depositReserves = DepositReservesSchema.load(event.params.pool.toString())

  if (!depositReserves) {
    depositReserves = new DepositReservesSchema(event.params.pool.toString())
    depositReserves.pool = event.params.pool
    depositReserves.reservesLen = event.params.reservesLen
    depositReserves.shares = event.params.shares
  }

  depositReserves.save()
}

export function handleWithdrawReserves(event: WithdrawReserves): void {
  let withdrawReserves = WithdrawReservesSchema.load(event.params.pool.toString())

  if (!withdrawReserves) {
    withdrawReserves = new WithdrawReservesSchema(event.params.pool.toString())
    withdrawReserves.pool = event.params.pool
    withdrawReserves.assets = event.params.assets
    withdrawReserves.reservesLen = event.params.reservesLen
  }

  withdrawReserves.save()
}

export function handleBorrowLiquidity(event: BorrowLiquidity): void {
  let borrowLiquidity = BorrowLiquiditySchema.load(event.params.tokenId.toString())

  if (!borrowLiquidity) {
    borrowLiquidity = new BorrowLiquiditySchema(event.params.tokenId.toString())
    borrowLiquidity.pool = event.params.pool
    borrowLiquidity.tokenId = event.params.tokenId
    borrowLiquidity.amountsLen = event.params.amountsLen
  }

  borrowLiquidity.save()
}

export function handleRepayLiquidity(event: RepayLiquidity): void {
  let repayLiquidity = RepayLiquiditySchema.load(event.params.tokenId.toString())

  if (!repayLiquidity) {
    repayLiquidity = new RepayLiquiditySchema(event.params.tokenId.toString())
    repayLiquidity.tokenId = event.params.tokenId
    repayLiquidity.lpTokensPaid = event.params.lpTokensPaid
    repayLiquidity.liquidityPaid = event.params.liquidityPaid
    repayLiquidity.pool = event.params.pool
    repayLiquidity.amountsLen = event.params.amountsLen
  }

  repayLiquidity.save()
}

export function handleIncreaseCollateral(event: IncreaseCollateral): void {
  let increaseCollateral = IncreaseCollateralSchema.load(event.params.tokenId.toString())

  if (!increaseCollateral) {
    increaseCollateral = new IncreaseCollateralSchema(event.params.tokenId.toString())
    increaseCollateral.pool = event.params.pool
    increaseCollateral.tokenId = event.params.tokenId
    increaseCollateral.tokensHeldLen = event.params.tokensHeldLen
  }

  increaseCollateral.save()
}

export function handleDecreaseCollateral(event: DecreaseCollateral): void {
  let decreaseCollateral = DecreaseCollateralSchema.load(event.params.tokenId.toString())

  if (!decreaseCollateral) {
    decreaseCollateral = new DecreaseCollateralSchema(event.params.tokenId.toString())
    decreaseCollateral.tokenId = event.params.tokenId
    decreaseCollateral.pool = event.params.pool
    decreaseCollateral.tokensHeldLen = event.params.tokensHeldLen
  }

  decreaseCollateral.save()
}

export function handleRebalanceCollateralWithLiquidity(event: RebalanceCollateralWithLiquidity): void {
  let rebalanceCollateralWithLiquidity = RebalanceCollateralWithLiquiditySchema.load(event.params.tokenId.toString())

  if (!rebalanceCollateralWithLiquidity) {
    rebalanceCollateralWithLiquidity = new RebalanceCollateralWithLiquiditySchema(event.params.tokenId.toString())
    rebalanceCollateralWithLiquidity.pool = event.params.pool
    rebalanceCollateralWithLiquidity.tokenId = event.params.tokenId
    rebalanceCollateralWithLiquidity.tokensHeldLen = event.params.tokensHeldLen
  }

  rebalanceCollateralWithLiquidity.save()
}
