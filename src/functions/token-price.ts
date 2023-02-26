import { TokenPrice } from "../../generated/schema"
import { ZERO_BD } from "../constants"

export function createTokenPrice(address: string): TokenPrice {
  let price = new TokenPrice(address)
  price.token = address
  price.derivedNative = ZERO_BD
  price.lastPriceUSD = ZERO_BD
  price.save()
  
  return price as TokenPrice
}

export function getTokenPrice(address: string): TokenPrice {
  return TokenPrice.load(address) as TokenPrice
}