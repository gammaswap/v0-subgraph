import { ethereum } from "@graphprotocol/graph-ts"
import {
  LiquidityPosition as LiquidityPositionEntity,
  LiquidityPositionSnapshot as LiquidityPositionSnapshotEntity,
} from "../../generated/schema"

export function createLiquidityPositionSnapshot(position: LiquidityPositionEntity, block: ethereum.Block): void {
  const timestamp = block.timestamp.toI32()

  const id = position.id
  .concat("-")
  .concat(timestamp.toString())

  const snapshot = new LiquidityPositionSnapshotEntity(id)
  snapshot.user = position.user
  snapshot.pool = position.pool
  snapshot.position = position.id
  snapshot.liquidityBalance = position.liquidityBalance
  snapshot.timestamp = block.timestamp
  snapshot.block = block.number

  snapshot.save()
}
