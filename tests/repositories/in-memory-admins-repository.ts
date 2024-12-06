import { Admin } from '@/domain/carrier/enterprise/entities/admin'
import { AdminsRepository } from '@/domain/carrier/application/repositories/admins-repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }
}
