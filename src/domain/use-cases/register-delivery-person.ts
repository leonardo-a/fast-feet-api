import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPerson } from '../entities/delivery-person'
import { AdminsRepository } from '../repositories/admins-repository'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists-error'
import { UnauthorizedError } from './errors/unauthorized-error'

export interface RegisterDeliveryPersonUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  UnauthorizedError | DeliveryPersonAlreadyExistsError,
  {
    deliveryPerson: DeliveryPerson
  }
>

export class RegisterDeliveryPersonUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    cpf,
    password,
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
    const admin = await this.adminsRepository.findById(userId)

    if (!admin) {
      return left(new UnauthorizedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryPersonWithSameCpf =
      await this.deliveryPersonsRepository.findByCPF(cpf)

    if (deliveryPersonWithSameCpf) {
      return left(new DeliveryPersonAlreadyExistsError(cpf))
    }

    const deliveryPerson = DeliveryPerson.create({
      cpf,
      name,
      password: hashedPassword,
    })

    await this.deliveryPersonsRepository.create(deliveryPerson)

    return right({
      deliveryPerson,
    })
  }
}
