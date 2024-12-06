import { makeAdmin } from 'tests/factories/make-admin'
import { makeDeliveryPerson } from 'tests/factories/make-delivery-person'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { InMemoryDeliveryPersonsRepository } from 'tests/repositories/in-memory-delivery-persons-repository'
import { FetchDeliveryPersonsUseCase } from './fetch-delivery-persons'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let sut: FetchDeliveryPersonsUseCase

describe('Fetch Delivery Persons Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()

    sut = new FetchDeliveryPersonsUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPersonsRepository,
    )
  })

  it('should be able to fetch delivery persons', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)
    inMemoryDeliveryPersonsRepository.items.push(makeDeliveryPerson())
    inMemoryDeliveryPersonsRepository.items.push(makeDeliveryPerson())

    const response = await sut.execute({
      userId: admin.id.toString(),
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.deliveryPersons).toHaveLength(2)
    }
  })

  it('should be able to paginate delivery persons list', async () => {
    const admin = makeAdmin()

    inMemoryAdminsRepository.items.push(admin)

    for (let i = 0; i < 22; i++) {
      inMemoryDeliveryPersonsRepository.items.push(
        makeDeliveryPerson({
          name: `Delivery Person ${i + 1}`,
        }),
      )
    }

    const response = await sut.execute({
      userId: admin.id.toString(),
      page: 2,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.deliveryPersons).toHaveLength(2)
      expect(response.value.deliveryPersons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Delivery Person 21' }),
          expect.objectContaining({ name: 'Delivery Person 22' }),
        ]),
      )
    }
  })

  it('should not be able to fetch delivery persons if user isnt an admin', async () => {
    inMemoryDeliveryPersonsRepository.items.push(makeDeliveryPerson())
    inMemoryDeliveryPersonsRepository.items.push(makeDeliveryPerson())

    const response = await sut.execute({
      userId: 'user-id-1',
      page: 1,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(UnauthorizedError)
  })
})
