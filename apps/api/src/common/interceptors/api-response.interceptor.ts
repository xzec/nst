import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import type { ApiResponseSuccess } from '~/common/types/api-response'

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept<T>(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseSuccess<T>> {
    return next.handle().pipe(map((data) => ({ success: true, data })))
  }
}
