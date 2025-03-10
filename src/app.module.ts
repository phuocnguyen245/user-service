import { Module } from '@nestjs/common';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [UserModule],
})
export class AppModule {}
