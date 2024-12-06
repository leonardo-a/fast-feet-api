import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/carrier/enterprise/entities/delivery-person'

export function makeDeliveryPerson(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityID,
) {
  const student = DeliveryPerson.create(
    {
      cpf: faker.string.numeric({ length: 11 }),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      role: 'DELIVERY_PERSON',
      ...override,
    },
    id,
  )

  return student
}
