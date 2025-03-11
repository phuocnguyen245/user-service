import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import RoleRepository from './role.repository';
import { Role } from '@prisma/client';

const message = {
  EXISTED: {
    message: 'Role already exists',
    code: 'ROLE_ALREADY_EXISTS',
  },
  NOT_FOUND: {
    message: 'Role not found',
    code: 'ROLE_NOT_FOUND',
  },
  NAME_TAKEN: {
    message: 'Role name is already taken',
    code: 'ROLE_NAME_TAKEN',
  },
};

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async createRole(role: Role) {
    const existingRole = await this.roleRepository.findRole({
      name: role.name,
    });
    if (existingRole) {
      throw new ConflictException(message.EXISTED);
    }
    return await this.roleRepository.createRole(role);
  }

  async updateRole(id: string, data: Partial<Role>) {
    const existingRole = await this.roleRepository.findRole({ id });

    if (!existingRole) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    if (data.name && existingRole.name !== data.name) {
      const roleWithSameName = await this.roleRepository.findRole({
        name: data.name,
      });

      if (roleWithSameName) {
        throw new ConflictException(message.NAME_TAKEN);
      }
    }

    return await this.roleRepository.updateRole(id, { name: data.name });
  }

  async updatePermissions(
    id: string,
    { permission, type }: { permission: string; type: 'add' | 'remove' },
  ) {
    const existingRole = await this.roleRepository.findRole({ id });

    if (!existingRole) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    let currentPermissions = existingRole.permissions;

    if (type === 'add') {
      currentPermissions = [...currentPermissions, permission];
    }
    if (type === 'remove') {
      currentPermissions = currentPermissions.filter(
        (currentPermission) => currentPermission !== permission,
      );
    }

    const permissionSet = new Set(currentPermissions);
    const permissions = Array.from(permissionSet);

    return await this.roleRepository.updateRole(id, { permissions });
  }

  async deleteRole(id: string) {
    const existingRole = await this.roleRepository.findRole({ id });

    if (!existingRole) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    return await this.roleRepository.deleteRole(id);
  }
}
