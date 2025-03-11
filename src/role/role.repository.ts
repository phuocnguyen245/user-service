import { prisma } from '@/config/prisma';
import { Role } from '@prisma/client';

class RoleRepository {
  async findRole({ id, name }: { id?: string; name?: string }) {
    return await prisma.role.findFirst({
      where: {
        OR: [{ id }, { name }],
      },
    });
  }

  async createRole(role: Role) {
    return await prisma.role.create({ data: role });
  }

  async updateRole(id: string, role: Partial<Role>) {
    return await prisma.role.update({ data: role, where: { id } });
  }

  async deleteRole(id: string) {
    return await this.updateRole(id, { isDeleted: true });
  }
}

export default RoleRepository;
