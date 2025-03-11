import { Module } from '@nestjs/common';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { UserModule } from '@/user/user.module';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { RoleModule } from './role/role.module';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  imports: [UserModule, RoleModule],
})
export class AppModule {}
