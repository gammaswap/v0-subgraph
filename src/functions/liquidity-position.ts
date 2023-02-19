import { LiquidityPosition as LiquidityPositionEntity, Pool as PoolEntity, User as UserEntity } from "../../generated/schema"
import { Deposit as DepositEvent } from "../../generated/templates/GammaPool/GammaPool"
import { ZERO_BI } from "../constants"

export function getOrCreateLiquidityPosition(event: DepositEvent, pool: PoolEntity, user: UserEntity, positionType: string): LiquidityPositionEntity {
  let id = user.id.concat("-").concat(pool.id).concat("-").concat(positionType)
  let position = LiquidityPositionEntity.load(id)
  if (position != null) {
    return position as LiquidityPositionEntity
  }

  position = new LiquidityPositionEntity(id)
  position.user = user.id
  position.pool = pool.id
  position.liquidityBalance = ZERO_BI
  position.closed = false
  position.save()
  return position as LiquidityPositionEntity
}