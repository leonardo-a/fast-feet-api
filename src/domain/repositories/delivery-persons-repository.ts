import { DeliveryPerson } from '../entities/delivery-person'

export abstract class DeliveryPersonsRepository {
  abstract findByCPF(cpf: string): Promise<DeliveryPerson | null>

  abstract findById(id: string): Promise<DeliveryPerson | null>

  abstract create(deliveryPerson: DeliveryPerson): Promise<void>

  abstract save(deliveryPerson: DeliveryPerson): Promise<void>

  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>
}
