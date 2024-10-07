import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor (private readonly localStrategy: LocalStrategy) {
        super();
    }
}
