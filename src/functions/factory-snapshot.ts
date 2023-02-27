import { BigInt, ethereum } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS, ZERO_BD } from '../constants'
import { getDayStartDate, getHourStartDate } from './time'
import { getOrCreateFactory } from './factory'
import {
  GSFactory as GSFactoryEntity,
  GSFactoryDayData, GSFactoryHourData
} from '../../generated/schema'

export function updateFactorySnapshots(event: ethereum.Event): void {
  const gammaswap = getOrCreateFactory()
  updateFactoryDaySnapshot(event, gammaswap)
  updateFactoryHourSnapshot(event, gammaswap)
}

function updateFactoryDaySnapshot(event: ethereum.Event, factory: GSFactoryEntity): void {
  let id = generateFactoryDaySnapshotId(event.block.timestamp)
  let snapshot = GSFactoryDayData.load(id)
  if (snapshot === null) {
    snapshot = new GSFactoryDayData(id)
    snapshot.factory = factory.id
    snapshot.date = getDayStartDate(event.block.timestamp)
    snapshot.totalVolumeUSD = ZERO_BD
    snapshot.totalVolumeETH = ZERO_BD
    snapshot.totalLiquidityUSD = ZERO_BD
    snapshot.totalLiquidityETH = ZERO_BD
    snapshot.totalSuppliedUSD = ZERO_BD
    snapshot.totalSuppliedETH = ZERO_BD
    snapshot.totalBorrowedUSD = ZERO_BD
    snapshot.totalBorrowedETH = ZERO_BD
    snapshot.totalCollateralUSD = ZERO_BD
    snapshot.totalCollateralETH = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values
  // snapshot.totalVolumeUSD = snapshot.totalVolumeUSD.plus(volume)
  // snapshot.totalVolumeETH = snapshot.totalVolumeETH.plus(volume)
  // snapshot.totalLiquidityUSD = factory.totalLiquidityUSD
  // snapshot.totalLiquidityETH = factory.totalLiquidityETH
  // snapshot.totalSuppliedUSD = factory.totalSuppliedUSD
  // snapshot.totalSuppliedETH = factory.totalSuppliedETH
  // snapshot.totalBorrowedUSD = factory.totalBorrowedUSD
  // snapshot.totalBorrowedETH = factory.totalBorrowedETH
  // snapshot.totalCollateralUSD = factory.totalCollateralUSD
  // snapshot.totalCollateralETH = factory.totalCollateralETH
  snapshot.txCount = snapshot.txCount + 1

  snapshot.save()
}

function updateFactoryHourSnapshot(event: ethereum.Event, factory: GSFactoryEntity): void {
  let id = generateFactoryHourSnapshotId(event.block.timestamp)
  let snapshot = GSFactoryHourData.load(id)
  if (snapshot === null) {
    snapshot = new GSFactoryHourData(id)
    snapshot.factory = factory.id
    snapshot.date = getHourStartDate(event.block.timestamp)
    snapshot.totalVolumeUSD = ZERO_BD
    snapshot.totalVolumeETH = ZERO_BD
    snapshot.totalLiquidityUSD = ZERO_BD
    snapshot.totalLiquidityETH = ZERO_BD
    snapshot.totalSuppliedUSD = ZERO_BD
    snapshot.totalSuppliedETH = ZERO_BD
    snapshot.totalBorrowedUSD = ZERO_BD
    snapshot.totalBorrowedETH = ZERO_BD
    snapshot.totalCollateralUSD = ZERO_BD
    snapshot.totalCollateralETH = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values
  // snapshot.totalVolumeUSD = snapshot.totalVolumeUSD.plus(volume)
  // snapshot.totalVolumeETH = snapshot.totalVolumeETH.plus(volume)
  // snapshot.totalLiquidityUSD = factory.totalLiquidityUSD
  // snapshot.totalLiquidityETH = factory.totalLiquidityETH
  // snapshot.totalSuppliedUSD = factory.totalSuppliedUSD
  // snapshot.totalSuppliedETH = factory.totalSuppliedETH
  // snapshot.totalBorrowedUSD = factory.totalBorrowedUSD
  // snapshot.totalBorrowedETH = factory.totalBorrowedETH
  // snapshot.totalCollateralUSD = factory.totalCollateralUSD
  // snapshot.totalCollateralETH = factory.totalCollateralETH
  snapshot.txCount = snapshot.txCount + 1

  snapshot.save()

}

function generateFactoryHourSnapshotId(timestamp: BigInt): string {
  let startDate = getHourStartDate(timestamp)
  return FACTORY_ADDRESS.concat("-hour-").concat(BigInt.fromI32(startDate).toString())
}

function generateFactoryDaySnapshotId(timestamp: BigInt): string {
  let startDate = getDayStartDate(timestamp)
  return FACTORY_ADDRESS.concat("-day-").concat(BigInt.fromI32(startDate).toString())
}