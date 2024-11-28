import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  address: string
  number: number
  postalCode: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
  }

  get number() {
    return this.props.number
  }

  get postalCode() {
    return this.props.postalCode
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(
      {
        ...props,
      },
      id,
    )

    return recipient
  }
}
