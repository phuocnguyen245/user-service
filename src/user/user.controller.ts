import { UserService } from '@/user/user.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { id: string }) {
    return await this.userService.getUser(data);
  }

  @GrpcMethod('UserService', 'Login')
  async login(data: { username: string; password: string }) {
    try {
      return await this.userService.login(data);
    } catch (error) {
      throw error;
    }
  }
}
