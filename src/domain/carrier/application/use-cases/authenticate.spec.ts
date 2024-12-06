import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { makeAdmin } from 'tests/factories/make-admin'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { InMemoryDeliveryPersonsRepository } from 'tests/repositories/in-memory-delivery-persons-repository'
import { AuthenticateUseCase } from './authenticate'
import { makeDeliveryPerson } from 'tests/factories/make-delivery-person'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()

    sut = new AuthenticateUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin({
      cpf: '99988877766',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const response = await sut.execute({
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate a delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson({
      cpf: '99988877766',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    let response = await sut.execute({
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(WrongCredentialsError)

    const deliveryPerson = makeDeliveryPerson({
      cpf: '99988877766',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    response = await sut.execute({
      cpf: '99988877766',
      password: '654321',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(WrongCredentialsError)
  })
})
