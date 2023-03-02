import { Address, BigInt } from "@graphprotocol/graph-ts"
import { getOrCreateToken } from "./token"
import { ZERO_BD } from "../constants"
import { getDayStartDate, getHourStartDate } from "./time"
import {
  Pool as PoolEntity,
  TokenHourData as TokenHourDataEntity,
  TokenDayData as TokenDayDataEntity,
} from "../../generated/schema"

export function updateTokenSnapshots(timestamp: BigInt, poolAddress: Address): void {
  const pool = PoolEntity.load(poolAddress.toHexString()) as PoolEntity
  const tokenLength = pool.tokens.length

  for (let i: i32 = 0; i < tokenLength; i++) {
    const token = pool.tokens[i]

    updateTokenHourSnapshot(timestamp, token)
    updateTokenDaySnapshot(timestamp, token)
  }
}

function updateTokenHourSnapshot(timestamp: BigInt, tokenAddress: string): void {
  const token = getOrCreateToken(tokenAddress)
  // get token price
  const id = generateTokenHourSnapshotId(tokenAddress, timestamp)

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
  // snapshot.liquidity = token.liquidity
  // snapshot.liquidityUSD = token.liquidityUSD
  // snapshot.liquidityETH = token.liquidityETH
  // snapshot.volume = snapshot.volume.plus(volume)
  // snapshot.volumeUSD = snapshot.volumeUSD.plus(volume)
  // snapshot.volumeETH = snapshot.volumeETH.plus(volume)
  // snapshot.priceUSD = tokenPrice.priceUSD
  // snapshot.priceETH = tokenPrice.priceETH
  snapshot.txCount = snapshot.txCount + 1

  snapshot.save()
}

function updateTokenDaySnapshot(timestamp: BigInt, tokenAddress: string): void {
  const token = getOrCreateToken(tokenAddress)
  // get token price
  const id = generateTokenDaySnapshotId(tokenAddress, timestamp)

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
  // snapshot.liquidity = token.liquidity
  // snapshot.liquidityUSD = token.liquidityUSD
  // snapshot.liquidityETH = token.liquidityETH
  // snapshot.volume = snapshot.volume.plus(volume)
  // snapshot.volumeUSD = snapshot.volumeUSD.plus(volume)
  // snapshot.volumeETH = snapshot.volumeETH.plus(volume)
  // snapshot.priceUSD = tokenPrice.priceUSD
  // snapshot.priceETH = tokenPrice.priceETH
  snapshot.txCount = snapshot.txCount + 1

  snapshot.save()
}

function generateTokenHourSnapshotId(tokenAddress: string, timestamp: BigInt): string {
  const startDate = getHourStartDate(timestamp)
  return tokenAddress.concat("-hour-").concat(BigInt.fromI32(startDate).toString())
}

function generateTokenDaySnapshotId(tokenAddress: string, timestamp: BigInt): string {
  const startDate = getDayStartDate(timestamp)
  return tokenAddress.concat("-day-").concat(BigInt.fromI32(startDate).toString())
}