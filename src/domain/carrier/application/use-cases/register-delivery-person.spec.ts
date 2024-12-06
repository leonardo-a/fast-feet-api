import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { makeAdmin } from 'tests/factories/make-admin'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { InMemoryDeliveryPersonsRepository } from 'tests/repositories/in-memory-delivery-persons-repository'
import { RegisterDeliveryPersonUseCase } from './register-delivery-person'
import { UnauthorizedError } from './errors/unauthorized-error'
import { makeDeliveryPerson } from 'tests/factories/make-delivery-person'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let sut: RegisterDeliveryPersonUseCase

describe('Register Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliveryPersonUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a delivery person', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const response = await sut.execute({
      userId: admin.id.toString(),
      name: 'John Doe',
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryDeliveryPersonsRepository.items).toHaveLength(1)
    expect(inMemoryDeliveryPersonsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        cpf: '99988877766',
      }),
    )
  })

  it('should hash delivery person password upon registration', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    const response = await sut.execute({
      userId: admin.id.toString(),
      name: 'John Doe',
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryDeliveryPersonsRepository.items).toHaveLength(1)
    expect(inMemoryDeliveryPersonsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        cpf: '99988877766',
        password: '123456-hashed',
      }),
    )
  })

  it('should not be able to register a delivery person if the user isnt an admin', async () => {
    const response = await sut.execute({
      userId: '1',
      name: 'John Doe',
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to register a delivery person if cpf is already in use', async () => {
    const admin = makeAdmin()
    const deliveryPerson = makeDeliveryPerson({
      cpf: '99988877766',
    })

    inMemoryAdminsRepository.items.push(admin)
    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: admin.id.toString(),
      name: 'John Doe',
      cpf: '99988877766',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(DeliveryPersonAlreadyExistsError)
  })
})
