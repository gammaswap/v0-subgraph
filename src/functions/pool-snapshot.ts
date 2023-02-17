import { ethereum, Address } from "@graphprotocol/graph-ts"
import { Pool as PoolEntity, PoolSnapshot as PoolSnapshotEntity } from "../../generated/schema"

export function createPoolSnapshot(event: ethereum.Event, pool: PoolEntity): PoolSnapshotEntity {
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