import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/carrier/enterprise/entities/admin'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const student = Admin.create(
    {
      cpf: faker.string.numeric({ length: 11 }),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      role: 'ADMIN',
      ...override,
    },
    id,
  )

  return student
}
