import { Address, ethereum } from '@graphprotocol/graph-ts'
import { Token as TokenEntity } from '../../generated/schema'
import { ZERO_BD, ZERO_BI } from '../constants'
import { TOKEN_MAP } from '../constants'

export function getOrCreateERC20Token(event: ethereum.Event, address: Address): TokenEntity {
  let addressHex = address.toHexString()
  let token = TokenEntity.load(addressHex)
  if (token != null) {
    return token as TokenEntity
  }

  token = new TokenEntity(addressHex)
  
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

  return token as TokenEntity
}

function getTokenInfo(address: Address): string[] {
  if (TOKEN_MAP.isSet(address)) {
    let symbol = TOKEN_MAP.get(address) as string[]
    return symbol
  }

  return ["TOKEN", "TKN"]
}