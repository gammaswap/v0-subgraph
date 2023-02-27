import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ZERO_BD } from "../constants"
import { getDayStartDate, getHourStartDate } from "./time"
import {
  Pool as PoolEntity,
  PoolHourData as PoolHourDataEntity,
  PoolDayData as PoolDayDataEntity,
} from "../../generated/schema"

export function updatePoolSnapshots(timestamp: BigInt, poolAddress: Address): void {
  let pool = PoolEntity.load(poolAddress.toHexString()) as PoolEntity

  updatePoolHourSnapshot(timestamp, pool)
  updatePoolDaySnapshot(timestamp, pool)
}

function updatePoolHourSnapshot(timestamp: BigInt, pool: PoolEntity): void {
  let id = generatePoolHourSnapshotId(pool.id, timestamp)

  let snapshot = PoolHourDataEntity.load(id)

  if (snapshot === null) {
    snapshot = new PoolHourDataEntity(id)
    snapshot.pool = pool.id
    snapshot.date = getHourStartDate(timestamp)
    snapshot.liquidity = ZERO_BD
    snapshot.liquidityUSD = ZERO_BD
    snapshot.liquidityETH = ZERO_BD
    snapshot.volume = ZERO_BD
    snapshot.volumeUSD = ZERO_BD
    snapshot.volumeETH = ZERO_BD
    snapshot.priceUSD = ZERO_BD
    snapshot.priceETH = ZERO_BD
    snapshot.borrowAPR = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values

  snapshot.save()
}

function updatePoolDaySnapshot(timestamp: BigInt, pool: PoolEntity): void {
  let id = generatePoolDaySnapshotId(pool.id, timestamp)

  let snapshot = PoolDayDataEntity.load(id)

  if (snapshot === null) {
    snapshot = new PoolDayDataEntity(id)
    snapshot.pool = pool.id
    snapshot.date = getDayStartDate(timestamp)
    snapshot.liquidity = ZERO_BD
    snapshot.liquidityUSD = ZERO_BD
    snapshot.liquidityETH = ZERO_BD
    snapshot.volume = ZERO_BD
    snapshot.volumeUSD = ZERO_BD
    snapshot.volumeETH = ZERO_BD
    snapshot.priceUSD = ZERO_BD
    snapshot.priceETH = ZERO_BD
    snapshot.borrowAPR = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values

  snapshot.save()
}

function generatePoolHourSnapshotId(poolAddress: string, timestamp: BigInt): string {
  let startDate = getHourStartDate(timestamp)
  return poolAddress.concat("-hour-").concat(BigInt.fromI32(startDate).toString())
}

function generatePoolDaySnapshotId(poolAddress: string, timestamp: BigInt): string {
  let startDate = getDayStartDate(timestamp)
  return poolAddress.concat("-day-").concat(BigInt.fromI32(startDate).toString())
}