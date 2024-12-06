export class DeliveryPersonAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`Delivery Person ${identifier} already exists`)
  }
}
