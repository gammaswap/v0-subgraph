import { PoolCreated as PoolCreatedEvent } from "../../generated/GammaPoolFactory/GammaPoolFactory"
import { Deposit as DepositEvent } from "../../generated/templates/GammaPool/GammaPool"
import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts"
import { TOKEN_MAP, PoolType, ZERO_BI, ZERO_BD, TransactionType, ONE_BD} from "../constants"
import {
  Pool as PoolEntity,
  Token as TokenEntity,
  PoolSnapshot as PoolSnapshotEntity,
  LiquidityPosition as LiquidityPositionEntity,
  LiquidityPositionSnapshot as LiquidityPositionSnapshotEntity,
  User as UserEntity,
  Transaction as TransactionEntity,
} from "../../generated/schema"

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

export function LPIntoPool(event: DepositEvent, user: UserEntity, pool: PoolEntity): LiquidityPositionEntity {
  let txID = user.id.concat("-").concat(event.transaction.hash.toHexString()).concat("-").concat(event.logIndex.toHexString())
  let transaction = new TransactionEntity(txID)
  transaction.txhash = event.transaction.hash
  transaction.pool = pool.id
  transaction.type = TransactionType.DEPOSIT_RESERVES
  transaction.from = getOrCreateUser(event.transaction.from).id
  if (event.transaction.to) {
    transaction.to = getOrCreateUser(event.transaction.to as Address).id
  }
  transaction.block = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.txIndexInBlock = event.transaction.index
  transaction.save()

  // handle creation and update of user's liquidity position & snapshot
  let position = getOrCreateLiquidityPosition(event, pool, user, transaction.type)
  createLiquidityPositionSnapshot(position, transaction)
  
  // update token balances and data
  // check if position is closed
  
  position.save()

  return position as LiquidityPositionEntity
}

function createPoolSnapshot(event: ethereum.Event, pool: PoolEntity): PoolSnapshotEntity {
  let id = pool.id.concat("-").concat(event.block.timestamp.toString())
  let snapshot = PoolSnapshotEntity.load(id)
  if (snapshot != null) {
    return snapshot as PoolSnapshotEntity
  }

  snapshot = new PoolSnapshotEntity(id)
  snapshot.address = Address.fromString(pool.id)
  snapshot.pool = pool.id
  snapshot.lpTokenBalance = pool.lpTokenBalance
  snapshot.lpTokenBorrowed = pool.lpTokenBorrowed
  snapshot.lpTokenBorrowedPlusInterest = pool.lpTokenBorrowedPlusInterest
  snapshot.accFeeIndex = pool.accFeeIndex
  snapshot.lpInvariant = pool.lpInvariant
  snapshot.borrowedInvariant = pool.borrowedInvariant
  snapshot.block = event.block.number
  snapshot.timestamp = event.block.timestamp
  snapshot.save()

  return snapshot as PoolSnapshotEntity
}

// export function borrowFromPool() {}
// export function updatePool() {}

function getOrCreateLiquidityPosition(event: DepositEvent, pool: PoolEntity, user: UserEntity, positionType: string): LiquidityPositionEntity {
  let id = user.id.concat("-").concat(pool.id).concat("-").concat(positionType)
  let position = LiquidityPositionEntity.load(id)
  if (position != null) {
    position.liquidityBalance = position.liquidityBalance.plus(event.params.shares)
    return position as LiquidityPositionEntity
  }

  position = new LiquidityPositionEntity(id)
  position.user = user.id
  position.pool = pool.id
  position.liquidityBalance = event.params.shares
  position.closed = false
  position.save()
  return position as LiquidityPositionEntity
}

function createLiquidityPositionSnapshot(position: LiquidityPositionEntity, transaction: TransactionEntity): void {
  let id = position.id.concat("-").concat(transaction.timestamp.toString())

  let snapshot = new LiquidityPositionSnapshotEntity(id)
  snapshot.user = position.user
  snapshot.pool = position.pool
  snapshot.position = position.id
  snapshot.transaction = transaction.id
  snapshot.liquidityBalance = position.liquidityBalance
  
  // TODO
  snapshot.tokensPriceUSD = []
  snapshot.tokenReserves = []
  snapshot.poolReservesUSD = ONE_BD
  snapshot.poolTokenSupply = ONE_BD
  
  snapshot.timestamp = transaction.timestamp
  snapshot.block = transaction.block

  snapshot.save()
}

export function getOrCreateUser(address: Address): UserEntity {
  let addressHex = address.toHexString()
  let user = UserEntity.load(addressHex)
  if (user != null) {
    return user as UserEntity
  }

  user = new UserEntity(addressHex)
  user.save()
  return user as UserEntity
}

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

export function getPoolTokens(event: PoolCreatedEvent): TokenEntity[] {
  let tokenLength = event.params.tokens.length
  let tokens = [] as TokenEntity[]

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