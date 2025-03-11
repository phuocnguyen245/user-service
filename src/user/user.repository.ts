import { prisma } from '@/config/prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
@Injectable()
class UserRepository {
  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });
  }

  async createUser(user: User) {
    return await prisma.user.create({
      data: user,
    });
  }

  async deleteUser(userId: string) {
    return await prisma.user.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: userId.toString(),
      },
    });
  }

  async updateUser(userId: string, user: Partial<User>) {
    return await prisma.user.update({
      data: user,
      where: {
        id: userId.toString(),
      },
    });
  }

  async findByUsernameAndEmail(username: string, email?: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: email || username }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    return user;
  }

  async hashPassword(password: string) {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}

export default UserRepository;
