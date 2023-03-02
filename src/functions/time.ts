import { BigInt } from "@graphprotocol/graph-ts"
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from "../constants/time"

export function getHourStartDate(timestamp: BigInt): i32 {
  const dayIndex = timestamp.toI32() / HOUR_IN_SECONDS
  return dayIndex * HOUR_IN_SECONDS
}

export function getDayStartDate(timestamp: BigInt): i32 {
  const dayIndex = timestamp.toI32() / DAY_IN_SECONDS
  return dayIndex * DAY_IN_SECONDS
}