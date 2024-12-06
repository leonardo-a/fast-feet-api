import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '../types/role'

export interface AdminProps {
  name: string
  cpf: string
  password: string
  role: Role
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: Omit<AdminProps, 'role'>, id?: UniqueEntityID) {
    const admin = new Admin(
      {
        ...props,
        role: 'ADMIN',
      },
      id,
    )

    return admin
  }
}
