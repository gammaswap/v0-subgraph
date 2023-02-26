import { Address, ethereum, log } from "@graphprotocol/graph-ts"
import { ZERO_BI } from "../constants"
import {
  LiquidityPosition as LiquidityPositionEntity,
  Pool as PoolEntity
} from "../../generated/schema"

export function getOrCreateLiquidityPosition(user: Address, pool: Address, block: ethereum.Block): LiquidityPositionEntity {
  let userAddress = user.toHexString()
  let poolId = pool.toHexString()

  // add position type?
  let id = poolId.concat("-").concat(userAddress)
  
  let position = LiquidityPositionEntity.load(id)
  
  if (position === null) {
    let pool = PoolEntity.load(poolId) as PoolEntity
    pool.lpCount = pool.lpCount + 1
    position = new LiquidityPositionEntity(id)
    position.user = userAddress
    position.pool = poolId
    position.liquidityBalance = ZERO_BI
    position.closed = false
    position.createdAtBlock = block.number
    position.createdAtTimestamp = block.timestamp
    pool.save()
    position.save()
  }

  if (position === null) log.error("position is null", [id])
  return position as LiquidityPositionEntity
}