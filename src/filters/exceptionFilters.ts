import { Catch, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Catch() // Remove RpcException to catch all exceptions
export class CustomRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.log('Exception caught:', exception);

    console.log('Exception caught:', exception);

    let error;
    if (exception instanceof RpcException) {
      error = exception.getError();
    } else {
      error = {
        code: status.INTERNAL,
        message: exception.message || 'Internal error',
        details: exception.stack,
      };
    }

    // Format error for gRPC
    const grpcError = {
      code: error.code || status.INTERNAL,
      message: error.message || 'Internal error',
      details: error.details || error.message || 'Unknown error',
    };

    return throwError(() => grpcError);
  }
}
