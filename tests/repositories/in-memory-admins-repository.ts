import { Admin } from '@/domain/entities/admin'
import { AdminsRepository } from '@/domain/repositories/admins-repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }
}
