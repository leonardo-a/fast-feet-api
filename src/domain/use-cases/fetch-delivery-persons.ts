import { Either, left, right } from '@/core/either'
import { DeliveryPerson } from '../entities/delivery-person'
import { AdminsRepository } from '../repositories/admins-repository'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

export interface FetchDeliveryPersonsUseCaseRequest {
  userId: string
  page: number
}

type FetchDeliveryPersonsUseCaseResponse = Either<
  UnauthorizedError,
  { deliveryPersons: DeliveryPerson[] }
>

export class FetchDeliveryPersonsUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryPersonsRepository: DeliveryPersonsRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchDeliveryPersonsUseCaseRequest): Promise<FetchDeliveryPersonsUseCaseResponse> {
    const admin = await this.adminsRepository.findById(userId)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryPersons = await this.deliveryPersonsRepository.findMany({
      page,
    })

    return right({
      deliveryPersons,
    })
  }
}
