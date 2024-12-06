import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AdminsRepository } from '../repositories/admins-repository'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

export interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    let user = await this.adminsRepository.findByCPF(cpf)

    if (!user) {
      user = await this.deliveryPersonsRepository.findByCPF(cpf)
    }

    if (user === null) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
    })

    return right({
      accessToken,
    })
  }
}
