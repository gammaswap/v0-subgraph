import { PoolCreated } from '../../generated/GammaPoolFactory/GammaPoolFactory'
import { GammaPool } from '../../generated/templates'
import { Pool as PoolCreatedSchema } from '../../generated/schema'
import { GammaSwapOverview as GammaSwapOverview } from '../../generated/schema'
import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { createdPoolsAndLoans as createdPoolsAndLoans } from '../../generated/schema'

export function handleGammaSwapOverview(): void {
    const overview = new GammaSwapOverview("hi")
    const created = createdPoolsAndLoans.load("CREATE")
    let borrowed: BigInt = new BigInt(0)
    let supplied: BigInt = new BigInt(0)
    let collateral: BigInt = new BigInt(0)
    if (created) {
        let length = created.IDcreatedPools.length
        for (let i = 0; i < length; i++) {
            let pool = PoolCreatedSchema.load(created.IDcreatedPools[i].toString())
            if (pool) {
                borrowed = borrowed.plus(pool.borrowedLiquidity)
                supplied = supplied.plus(pool.suppliedLiquidity)
                collateral = collateral.plus(pool.totalCollateral)
            }
        }
        overview.totalBorrowed = BigInt.fromString(borrowed.toString())
        overview.totalSupplied = BigInt.fromString(supplied.toString())
        overview.totalCollateral = BigInt.fromString(collateral.toString())
        overview.save()

    }
}
