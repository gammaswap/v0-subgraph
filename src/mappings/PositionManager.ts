import { CreateLoan } from '../../generated/PositionManager/PositionManager'
import { CreateLoanEntity } from '../../generated/schema'

export function handleCreateLoan(event: CreateLoan): void {
  let loan = CreateLoanEntity.load(event.params.tokenId.toString())

  if (!loan) {
    loan = new CreateLoanEntity(event.params.tokenId.toString()) 
    loan.pool = event.params.pool
    loan.tokenId = event.params.tokenId
  }

  loan.save()
}
