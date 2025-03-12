import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import UserRepository from './user.repository';
const message = {
  NOT_FOUND: {
    message: 'Invalid username or password',
    code: 'invalid.username.or.password',
  },
  CONFLICT: {
    message: 'User already exists',
    code: 'user.already.exists',
  },
};

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUser(id: string) {
    const user = await this.userRepo.getUserById(id);
    if (!user) {
      return new NotFoundException(message.NOT_FOUND);
    }
    return user;
  }

  async login(data: { username: string; password: string }) {
    const existingUser = await this.userRepo.findByUsernameAndEmail(
      data.username,
    );

    if (
      !existingUser ||
      (await this.userRepo.comparePassword(
        data.password,
        existingUser.password,
      ))
    ) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };
  }

  async register(data: User) {
    const existingUser = await this.userRepo.findByUsernameAndEmail(
      data.username,
      data.email,
    );
    if (existingUser) {
      throw new ConflictException(message.CONFLICT);
    }

    const hashedPassword = await this.userRepo.hashPassword(data.password);
    return await this.userRepo.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async forgotPassword(id: string, data: { password: string }) {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    const newPassword = await this.userRepo.hashPassword(data.password);

    const updatedUser = await this.userRepo.updateUser(id, {
      password: newPassword,
    });

    return updatedUser;
  }

  async changePassword(
    id: string,
    data: { oldPassword: string; newPassword: string },
  ) {
    const existingUser = await this.userRepo.getUserById(id);

    if (!existingUser) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    const isPasswordMatch = await this.userRepo.comparePassword(
      data.oldPassword,
      existingUser.name,
    );

    if (!isPasswordMatch) {
      throw new NotFoundException(message.NOT_FOUND);
    }

    const newPassword = await this.userRepo.hashPassword(data.newPassword);

    const updatedUser = await this.userRepo.updateUser(id, {
      password: newPassword,
    });

    return updatedUser;
  }
}
