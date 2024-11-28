import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParcelProps {
  recipientId: UniqueEntityID
  deliveryPersonId: UniqueEntityID
  status: 'pending' | 'awaiting_pickup' | 'picked_up' | 'delivered' | 'returned'
  createdAt: Date
  updatedAt?: Date | null
}

export class Parcel extends Entity<ParcelProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ParcelProps, id?: UniqueEntityID) {
    const parcel = new Parcel(
      {
        ...props,
      },
      id,
    )

    return parcel
  }
}
