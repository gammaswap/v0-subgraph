import { CreateLoan } from '../../generated/PositionManager/PositionManager'
import { Loan } from '../../generated/schema'

export function handleCreateLoan(event: CreateLoan): void {
  let loan = Loan.load(event.params.tokenId.toString())

  if (!loan) {
    loan = new Loan(event.params.tokenId.toString()) 
    loan.pool = event.params.pool
    loan.tokenId = event.params.tokenId
  }

  loan.save()
}
