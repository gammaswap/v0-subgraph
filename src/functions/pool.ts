import { PoolCreated as PoolCreatedEvent } from "../../generated/GammaPoolFactory/GammaPoolFactory"
import { Token as TokenEntity, Pool as PoolEntity } from "../../generated/schema"
import { getOrCreateERC20Token } from "../functions/token"
import { PoolType } from "../constants"

export function getPoolTokens(event: PoolCreatedEvent): TokenEntity[] {
  let tokenLength = event.params.tokens.length
  let tokens = [] as TokenEntity[]

  for (let i: i32 = 0; i < tokenLength; i++) {
    let token = getOrCreateERC20Token(event, event.params.tokens[i])
    tokens.push(token)
  }

  return tokens
}

export function generatePoolSymbol(tokens: TokenEntity[]): string {
  let symbol = ""
  for (let i: i32 = 0; i < tokens.length; i++) {
    symbol = symbol + tokens[i].symbol
    if (i != tokens.length - 1) symbol = symbol + "/"
  }

  return symbol
}

export function generatePoolName(implementationID: number): string {
  if (implementationID == PoolType.UNISWAP_V2) return "Uniswap V2 Pool"
  else if (implementationID == PoolType.BALANCER_5050) return "Balancer 50/50 Pool"
  else if (implementationID == PoolType.BALANCER_8020) return "Balancer 80/20 Pool"
  else return "SushiSwap Pool"
}