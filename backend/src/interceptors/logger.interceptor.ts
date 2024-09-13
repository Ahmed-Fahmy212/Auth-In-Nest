import { Logger, Injectable, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestLogger');

  constructor(private readonly configService: ConfigService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, originalUrl, headers, httpVersion, query, url, body } = req;
    const now = Date.now();

    if (this.configService.get('REQ_LOGGING') === 'false') {
      return next.handle();
    }
    return next.handle().pipe(
      tap((data) => {
        const { statusCode } = res;
        const duration = Date.now() - now;
        this.logger.log(`HTTP ${method} ${originalUrl} `);
        this.logger.log({
          req: {
            method,
            originalUrl,
            query,
            url,
            body,
          },
          res: {
            body: data,
            statusCode,
          },
          date: new Date().toISOString(),
          duration: `${duration}ms`,

        });
        this.logger.log(`=======================================================`);
      })
    );
  }
}
