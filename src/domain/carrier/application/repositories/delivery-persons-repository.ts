import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

export abstract class DeliveryPersonsRepository {
  abstract findByCPF(cpf: string): Promise<DeliveryPerson | null>

  abstract findById(id: string): Promise<DeliveryPerson | null>

  abstract findMany(params: PaginationParams): Promise<DeliveryPerson[]>

  abstract create(deliveryPerson: DeliveryPerson): Promise<void>

  abstract save(deliveryPerson: DeliveryPerson): Promise<void>

  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>
}
