import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryPersonProps {
  name: string
  cpf: string
  password: string
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

  static create(props: DeliveryPersonProps, id?: UniqueEntityID) {
    const deliveryperson = new DeliveryPerson(
      {
        ...props,
      },
      id,
    )

    return deliveryperson
  }
}
