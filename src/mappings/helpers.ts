import { Bytes, Address, ethereum, BigInt, BigDecimal, log } from "@graphprotocol/graph-ts"
import { ERC20 } from "../../generated/GammaPoolFactory/ERC20"
import { Pool, Token } from "../../generated/schema"
import { PoolCreated as PoolCreatedEvent } from "../../generated/GammaPoolFactory/GammaPoolFactory"
import { TOKEN_MAP } from "../constants"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const UNISWAPV2_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
export const FACTORY_ADDRESS = '0x862654Cfa91cEfb48A3D55108c353eC2Bca1794A'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let SIX_BI = BigInt.fromI32(6)
export let SIX_BD = BigDecimal.fromString('6')
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

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
  
  log.warning("ADDRESS HEX: {}", [addressHex])
  let tokenInfo = getTokenInfo(address)
  token.name = tokenInfo[0]
  token.symbol = tokenInfo[1]
  token.decimals = 18 // to change

  // let tokenInstance = ERC20.bind(address)
  // let tryName = tokenInstance.try_name()
  // if (!tryName.reverted) {
  //   token.name = tryName.value
  // }

  // let trySymbol = tokenInstance.try_symbol()
  // if (!trySymbol.reverted) {
  //   token.symbol = trySymbol.value
  // }

  // let tryDecimals = tokenInstance.try_decimals()
  // if (!tryDecimals.reverted) {       
  //   token.decimals = tryDecimals.value
  // }
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
  log.warning("IM IN GETPOOLTOKENS", [])
  let tokenLength = event.params.tokens.length
  let tokens = [] as Token[]

  for (let i: i32 = 0; i < tokenLength; i++) {
    log.warning("LOOPING {}", [i.toString()])
    let token = getOrCreateERC20Token(event, event.params.tokens[i])
    tokens.push(token)
  }
  log.warning("IM IN GETPOOLTOKENS END", [])

  return tokens
}

function getTokenInfo(address: Address): string[] {
  log.warning("BRUH COME ON {}", [address.toString()])

  if (TOKEN_MAP.isSet(address)) {
    let symbol = TOKEN_MAP.get(address) as string[]
    return symbol
  }

  return ["TOKEN", "TKN"]
}