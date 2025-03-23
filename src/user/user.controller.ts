import { UserService } from '@/user/user.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { id: string }) {
    return await this.userService.getUser(data.id);
  }

  @GrpcMethod('UserService', 'Login')
  async login(data: { username: string; password: string }) {
    try {
      const user = await this.userService.login(data);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('UserService', 'Register')
  async register(data: User) {
    try {
      const user = await this.userService.register(data);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('UserService', 'ForgotPassword')
  async forgotPassword(data: { id: string; password: string }) {
    try {
      const user = await this.userService.forgotPassword(data.id, data);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
