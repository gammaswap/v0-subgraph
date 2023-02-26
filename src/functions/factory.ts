import { GSFactory as GSFactoryEntity } from "../../generated/schema"
import { FACTORY_ADDRESS, ZERO_BD } from "../constants"

export function getOrCreateFactory(): GSFactoryEntity {
  let factory = GSFactoryEntity.load(FACTORY_ADDRESS)

  if (factory === null) {
    factory = new GSFactoryEntity(FACTORY_ADDRESS)
    factory.totalVolumeUSD = ZERO_BD
    factory.totalVolumeETH = ZERO_BD
    factory.totalLiquidityUSD = ZERO_BD
    factory.totalLiquidityETH = ZERO_BD
    factory.totalSuppliedUSD = ZERO_BD
    factory.totalSuppliedETH = ZERO_BD
    factory.totalBorrowedUSD = ZERO_BD
    factory.totalBorrowedETH = ZERO_BD
    factory.totalCollateralUSD = ZERO_BD
    factory.totalCollateralETH = ZERO_BD
    factory.txCount = 0
    factory.poolCount = 0
    factory.save()
  }

  return factory as GSFactoryEntity
}