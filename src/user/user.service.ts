import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../config/prisma';
import { RpcException } from '@nestjs/microservices';

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
        username: data.username,
        password: data.password,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid username or password');
    }
    return user;
  }
}
