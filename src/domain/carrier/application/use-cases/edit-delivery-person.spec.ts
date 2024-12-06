import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { makeAdmin } from 'tests/factories/make-admin'
import { makeDeliveryPerson } from 'tests/factories/make-delivery-person'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { InMemoryDeliveryPersonsRepository } from 'tests/repositories/in-memory-delivery-persons-repository'
import { EditDeliveryPersonUseCase } from './edit-delivery-person'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let sut: EditDeliveryPersonUseCase

describe('Edit Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()

    sut = new EditDeliveryPersonUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPersonsRepository,
      fakeHasher,
    )
  })

  it('should be able to edit a delivery person', async () => {
    const admin = makeAdmin()
    const deliveryPerson = makeDeliveryPerson()

    inMemoryAdminsRepository.items.push(admin)
    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'John Doe',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryDeliveryPersonsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    )
  })

  it('should not be able to edit a delivery person if the user is not an admin', async () => {
    const deliveryPerson = makeDeliveryPerson()

    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: deliveryPerson.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'John Doe',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to hash the new delivery person password', async () => {
    const admin = makeAdmin()
    const deliveryPerson = makeDeliveryPerson()

    inMemoryAdminsRepository.items.push(admin)
    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryDeliveryPersonsRepository.items[0].password).toContain(
      '-hashed',
    )
  })
})
