import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '../types/role'

export interface DeliveryPersonProps {
  name: string
  cpf: string
  password: string
  role: Role
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: Omit<DeliveryPersonProps, 'role'>, id?: UniqueEntityID) {
    const deliveryperson = new DeliveryPerson(
      {
        ...props,
        role: 'DELIVERY_PERSON',
      },
      id,
    )

    return deliveryperson
  }
}
