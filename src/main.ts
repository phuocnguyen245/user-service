import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomRpcExceptionFilter } from './filters/exceptionFilters';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: 'src/proto/user.proto',
        url: '0.0.0.0:50051',
      },
    },
  );

  app.useGlobalFilters(new CustomRpcExceptionFilter());
  await app.listen();
  console.log('🚀 User Service is running on gRPC port 50051');
}
bootstrap();
