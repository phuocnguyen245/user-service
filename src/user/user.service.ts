import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../config/prisma';

@Injectable()
export class UserService {
  async getUser(data: { id: string }) {
    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return { id: '', name: '', email: '' };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(data: { username: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.username,
          },
          {
            username: data.username,
          },
        ],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
