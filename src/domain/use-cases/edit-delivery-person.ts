import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPerson } from '../entities/delivery-person'
import { AdminsRepository } from '../repositories/admins-repository'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

export interface EditDeliveryPersonUseCaseRequest {
  userId: string
  deliveryPersonId: string
  name?: string
  password?: string
}

type EditDeliveryPersonUseCaseResponse = Either<
  UnauthorizedError | ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson
  }
>

export class EditDeliveryPersonUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    deliveryPersonId,
    name,
    password,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
    const admin = await this.adminsRepository.findById(userId)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    if (!name && !password) {
      return right({
        deliveryPerson,
      })
    }

    if (name) {
      deliveryPerson.name = name
    }

    if (password) {
      deliveryPerson.password = await this.hashGenerator.hash(password)
    }

    await this.deliveryPersonsRepository.save(deliveryPerson)

    return right({
      deliveryPerson,
    })
  }
}
