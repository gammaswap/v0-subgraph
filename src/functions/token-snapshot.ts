import { Address, BigInt } from "@graphprotocol/graph-ts"
import { getOrCreateToken } from "./token"
import { HOUR_IN_SECONDS, DAY_IN_SECONDS } from "../constants/time"
import { ZERO_BD } from "../constants"
import {
  Pool as PoolEntity,
  TokenHourData as TokenHourDataEntity,
  TokenDayData as TokenDayDataEntity,
} from "../../generated/schema"

export function updateTokenSnapshots(timestamp: BigInt, poolAddress: Address): void {
  let pool = PoolEntity.load(poolAddress.toHexString()) as PoolEntity
  let tokenLength = pool.tokens.length

  for (let i: i32 = 0; i < tokenLength; i++) {
    let token = pool.tokens[i]

    updateTokenHourSnapshot(timestamp, token)
    updateTokenDaySnapshot(timestamp, token)
  }
}

function updateTokenHourSnapshot(timestamp: BigInt, tokenAddress: string): void {
  let token = getOrCreateToken(tokenAddress)
  let id = generateTokenHourSnapshotId(tokenAddress, timestamp)

  let snapshot = TokenHourDataEntity.load(id)

  if (snapshot === null) {
    snapshot = new TokenHourDataEntity(id)
    snapshot.token = token.id
    snapshot.date = getHourStartDate(timestamp)
    snapshot.liquidity = ZERO_BD
    snapshot.liquidityUSD = ZERO_BD
    snapshot.liquidityETH = ZERO_BD
    snapshot.volume = ZERO_BD
    snapshot.volumeUSD = ZERO_BD
    snapshot.volumeETH = ZERO_BD
    snapshot.priceUSD = ZERO_BD
    snapshot.priceETH = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values

  snapshot.save()
}

function updateTokenDaySnapshot(timestamp: BigInt, tokenAddress: string): void {
  let token = getOrCreateToken(tokenAddress)
  let id = generateTokenDaySnapshotId(tokenAddress, timestamp)

  let snapshot = TokenDayDataEntity.load(id)

  if (snapshot === null) {
    snapshot = new TokenDayDataEntity(id)
    snapshot.token = token.id
    snapshot.date = getDayStartDate(timestamp)
    snapshot.liquidity = ZERO_BD
    snapshot.liquidityUSD = ZERO_BD
    snapshot.liquidityETH = ZERO_BD
    snapshot.volume = ZERO_BD
    snapshot.volumeUSD = ZERO_BD
    snapshot.volumeETH = ZERO_BD
    snapshot.priceUSD = ZERO_BD
    snapshot.priceETH = ZERO_BD
    snapshot.txCount = 0
  }

  // if it exists, update the values

  snapshot.save()
}

function getHourStartDate(timestamp: BigInt): i32 {
  let dayIndex = timestamp.toI32() / HOUR_IN_SECONDS
  return dayIndex * HOUR_IN_SECONDS
}

function generateTokenHourSnapshotId(tokenAddress: string, timestamp: BigInt): string {
  let startDate = getHourStartDate(timestamp)
  return tokenAddress.concat("-hour-").concat(BigInt.fromI32(startDate).toString())
}

function getDayStartDate(timestamp: BigInt): i32 {
  let dayIndex = timestamp.toI32() / DAY_IN_SECONDS
  return dayIndex * DAY_IN_SECONDS
}

function generateTokenDaySnapshotId(tokenAddress: string, timestamp: BigInt): string {
  let startDate = getDayStartDate(timestamp)
  return tokenAddress.concat("-day-").concat(BigInt.fromI32(startDate).toString())
}