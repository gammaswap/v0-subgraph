import { Address } from '@graphprotocol/graph-ts'
import { User as UserEntity } from '../../generated/schema'

export function getOrCreateUser(address: Address): UserEntity {
  const addressHex = address.toHexString()
  let user = UserEntity.load(addressHex)
  if (user != null) {
    return user as UserEntity
  }

  user = new UserEntity(addressHex)
  user.save()
  return user as UserEntity
}