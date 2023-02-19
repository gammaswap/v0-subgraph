import { LiquidityPosition as LiquidityPositionEntity } from "../../generated/schema"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import { ZERO_BI } from "../constants"

export function getOrCreateLiquidityPosition(user: Address, pool: Address, block: ethereum.Block): LiquidityPositionEntity {
  let userAddress = user.toHexString()
  let poolId = pool.toHexString()

  let id = userAddress.concat("-").concat(poolId).concat("-")
  
  let position = LiquidityPositionEntity.load(id)
  
  if (position === null) {
    position = new LiquidityPositionEntity(id)
    position.user = userAddress
    position.pool = poolId
    position.liquidityBalance = ZERO_BI
    position.closed = false
    position.createdAtBlock = block.number
    position.createdAtTimestamp = block.timestamp
    position.save()
  }

  return position as LiquidityPositionEntity
}