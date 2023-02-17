import { ONE_BD } from "../constants"
import {
  LiquidityPosition as LiquidityPositionEntity,
  LiquidityPositionSnapshot as LiquidityPositionSnapshotEntity,
  Transaction as TransactionEntity
} from "../../generated/schema"

export function createLiquidityPositionSnapshot(position: LiquidityPositionEntity, transaction: TransactionEntity): void {
  let id = position.id.concat("-").concat(transaction.timestamp.toString())

  let snapshot = new LiquidityPositionSnapshotEntity(id)
  snapshot.user = position.user
  snapshot.pool = position.pool
  snapshot.position = position.id
  snapshot.transaction = transaction.id
  snapshot.liquidityBalance = position.liquidityBalance
  
  // TODO
  snapshot.tokensPriceUSD = []
  snapshot.tokenReserves = []
  snapshot.poolReservesUSD = ONE_BD
  snapshot.poolTokenSupply = ONE_BD
  
  snapshot.timestamp = transaction.timestamp
  snapshot.block = transaction.block

  snapshot.save()
}
