import { Admin } from '../entities/admin'

export abstract class AdminsRepository {
  abstract findByCPF(cpf: string): Promise<Admin | null>
  abstract findById(id: string): Promise<Admin | null>
}
