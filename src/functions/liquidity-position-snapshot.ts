import { ONE_BD } from "../constants"
import { ethereum } from "@graphprotocol/graph-ts"
import {
  LiquidityPosition as LiquidityPositionEntity,
  LiquidityPositionSnapshot as LiquidityPositionSnapshotEntity,
} from "../../generated/schema"

export function createLiquidityPositionSnapshot(position: LiquidityPositionEntity, block: ethereum.Block): void {
  let timestamp = block.timestamp.toI32()

  let id = position.id
  .concat("-")
  .concat(timestamp.toString())

  let snapshot = new LiquidityPositionSnapshotEntity(id)
  snapshot.user = position.user
  snapshot.pool = position.pool
  snapshot.position = position.id
  snapshot.liquidityBalance = position.liquidityBalance
  
  // TODO
  snapshot.tokensPriceUSD = []
  snapshot.tokenReserves = []
  snapshot.poolReservesUSD = ONE_BD
  snapshot.poolTokenSupply = ONE_BD
  
  snapshot.timestamp = block.timestamp
  snapshot.block = block.number

  snapshot.save()
}
