import { Address, ethereum } from '@graphprotocol/graph-ts'
import { GSFactory as GSFactoryEntity, Token as TokenEntity } from '../../generated/schema'
import { ZERO_BD, ZERO_BI } from '../constants'
import { TOKEN_MAP, FACTORY_ADDRESS } from '../constants'
import { createTokenPrice } from './token-price'

export function getOrCreateToken(address: string): TokenEntity {
  let token = TokenEntity.load(address)
  
  if (token === null) {
    token = new TokenEntity(address)
    createTokenPrice(address)
    
    // need to finalize attributes
    let tokenInfo = getTokenInfo(Address.fromString(address))
    token.name = tokenInfo[0]
    token.symbol = tokenInfo[1]
    token.decimals = 18 // to change
    token.price = address
    token.totalSupply = ZERO_BI // might be a contract call
    token.totalLiquidity = ZERO_BD
    token.tradeVolume = ZERO_BD
    token.txCount = 0
    token.save()

    const gammaswap = GSFactoryEntity.load(FACTORY_ADDRESS) as GSFactoryEntity
    gammaswap.txCount = gammaswap.txCount + 1
    gammaswap.save()
  }

  return token as TokenEntity
}

function getTokenInfo(address: Address): string[] {
  if (TOKEN_MAP.isSet(address)) {
    let symbol = TOKEN_MAP.get(address) as string[]
    return symbol
  }

  return ["TOKEN", "TKN"]
}