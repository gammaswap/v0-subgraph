import { Address, ethereum, BigInt, log } from "@graphprotocol/graph-ts"
import { Pool, Token } from "../../generated/schema"
import { PoolCreated as PoolCreatedEvent } from "../../generated/GammaPoolFactory/GammaPoolFactory"
import { TOKEN_MAP, PoolType, ZERO_BI, ZERO_BD } from "../constants"

// TODO: adjust types
export function calcLPTokenBorrowedPlusInterest(
  borrowedInvariant: BigInt,
  lastCFMMTotalSupply: BigInt,
  lastCFMMInvariant: BigInt
): BigInt {
  if (lastCFMMInvariant != ZERO_BI) {
    let lpTokenBorrowedPlusInterest = (borrowedInvariant.times(lastCFMMTotalSupply)).div(lastCFMMInvariant)
    return lpTokenBorrowedPlusInterest
  }

  return ZERO_BI
}

export function getOrCreateERC20Token(event: ethereum.Event, address: Address): Token {
  let addressHex = address.toHexString()
  let token = Token.load(addressHex)
  if (token != null) {
    return token as Token
  }

  token = new Token(addressHex)
  
  let tokenInfo = getTokenInfo(address)
  token.name = tokenInfo[0]
  token.symbol = tokenInfo[1]
  token.decimals = 18 // to change
  token.totalSupply = ZERO_BI // might be a contract call
  token.totalLiquidity = ZERO_BD
  token.tradeVolume = ZERO_BD
  token.lastPriceUSD = ZERO_BD
  token.block = event.block.number
  token.timestamp = event.block.timestamp
  token.txCount = 0
  token.save()

  return token as Token
}

export function getPoolTokens(event: PoolCreatedEvent): Token[] {
  let tokenLength = event.params.tokens.length
  let tokens = [] as Token[]

  for (let i: i32 = 0; i < tokenLength; i++) {
    let token = getOrCreateERC20Token(event, event.params.tokens[i])
    tokens.push(token)
  }

  return tokens
}

function getTokenInfo(address: Address): string[] {
  if (TOKEN_MAP.isSet(address)) {
    let symbol = TOKEN_MAP.get(address) as string[]
    return symbol
  }

  return ["TOKEN", "TKN"]
}

export function generatePoolSymbol(tokens: Token[]): string {
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