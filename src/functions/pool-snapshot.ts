import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ZERO_BD } from "../constants"
import { getDayStartDate, getHourStartDate } from "./time"
import {
  Pool as PoolEntity,
  PoolHourData as PoolHourDataEntity,
  PoolDayData as PoolDayDataEntity,
} from "../../generated/schema"

export function updatePoolSnapshots(timestamp: BigInt, poolAddress: Address): void {
  const pool = PoolEntity.load(poolAddress.toHexString()) as PoolEntity

  updatePoolHourSnapshot(timestamp, pool)
  updatePoolDaySnapshot(timestamp, pool)
}

function updatePoolHourSnapshot(timestamp: BigInt, pool: PoolEntity): void {
  const id = generatePoolHourSnapshotId(pool.id, timestamp)

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
    snapshot.borrowAPR = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values
  // snapshot.liquidity = pool.liquidity
  // snapshot.liquidityUSD = pool.liquidityUSD
  // snapshot.liquidityETH = pool.liquidityETH
  // snapshot.volume = snapshot.volume.plus(volume)
  // snapshot.volumeUSD = snapshot.volumeUSD.plus(volume)
  // snapshot.volumeETH = snapshot.volumeETH.plus(volume)
  // snapshot.borrowAPR = pool.borrowAPR
  snapshot.txCount = snapshot.txCount + 1

  snapshot.save()
}

function updatePoolDaySnapshot(timestamp: BigInt, pool: PoolEntity): void {
  const id = generatePoolDaySnapshotId(pool.id, timestamp)

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
    snapshot.borrowAPR = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values
  // snapshot.liquidity = pool.liquidity
  // snapshot.liquidityUSD = pool.liquidityUSD
  // snapshot.liquidityETH = pool.liquidityETH
  // snapshot.volume = snapshot.volume.plus(volume)
  // snapshot.volumeUSD = snapshot.volumeUSD.plus(volume)
  // snapshot.volumeETH = snapshot.volumeETH.plus(volume)
  // snapshot.borrowAPR = pool.borrowAPR
  snapshot.txCount = snapshot.txCount + 1


  snapshot.save()
}

function generatePoolHourSnapshotId(poolAddress: string, timestamp: BigInt): string {
  const startDate = getHourStartDate(timestamp)
  return poolAddress.concat("-hour-").concat(BigInt.fromI32(startDate).toString())
}

function generatePoolDaySnapshotId(poolAddress: string, timestamp: BigInt): string {
  const startDate = getDayStartDate(timestamp)
  return poolAddress.concat("-day-").concat(BigInt.fromI32(startDate).toString())
}