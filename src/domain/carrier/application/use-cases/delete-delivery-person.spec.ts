import { makeAdmin } from 'tests/factories/make-admin'
import { makeDeliveryPerson } from 'tests/factories/make-delivery-person'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { InMemoryDeliveryPersonsRepository } from 'tests/repositories/in-memory-delivery-persons-repository'
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let sut: DeleteDeliveryPersonUseCase

describe('Delete Delivery Person Use Case', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()

    sut = new DeleteDeliveryPersonUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPersonsRepository,
    )
  })

  it('should be able to delete a delivery person', async () => {
    const admin = makeAdmin()
    const deliveryPerson = makeDeliveryPerson()

    inMemoryAdminsRepository.items.push(admin)
    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryDeliveryPersonsRepository.items).toHaveLength(0)
  })

  it('should not be able to edit a delivery person if the user is not an admin', async () => {
    const deliveryPerson = makeDeliveryPerson()

    inMemoryDeliveryPersonsRepository.items.push(deliveryPerson)

    const response = await sut.execute({
      userId: deliveryPerson.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedError)
  })
})
