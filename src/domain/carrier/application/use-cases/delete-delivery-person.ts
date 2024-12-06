import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

export interface DeleteDeliveryPersonUseCaseRequest {
  userId: string
  deliveryPersonId: string
}

type DeleteDeliveryPersonUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  null
>

export class DeleteDeliveryPersonUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryPersonsRepository: DeliveryPersonsRepository,
  ) {}

  async execute({
    userId,
    deliveryPersonId,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
    const admin = await this.adminsRepository.findById(userId)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryPersonsRepository.delete(deliveryPerson)

    return right(null)
  }
}
