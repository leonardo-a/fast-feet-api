import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryPerson } from '@/domain/entities/delivery-person'
import { DeliveryPersonsRepository } from '@/domain/repositories/delivery-persons-repository'

export class InMemoryDeliveryPersonsRepository
  implements DeliveryPersonsRepository
{
  public items: DeliveryPerson[] = []

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    this.items.push(deliveryPerson)
  }

  async save(deliveryPerson: DeliveryPerson): Promise<void> {
    const deliveryPersonIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items[deliveryPersonIndex] = deliveryPerson
  }

  async delete(deliveryPerson: DeliveryPerson): Promise<void> {
    const deliveryPersonIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items.splice(deliveryPersonIndex, 1)
  }

  async findByCPF(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = this.items.find((item) => item.cpf === cpf)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async findById(id: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async findMany({ page }: PaginationParams): Promise<DeliveryPerson[]> {
    const limit = 20

    const deliveryPersons = this.items.slice((page - 1) * limit, page * limit)

    return deliveryPersons
  }
}
