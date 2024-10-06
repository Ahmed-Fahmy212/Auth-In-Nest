import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { RefreshTokenStrategy } from "src/modules/auth/strategies/refresh-token.strategy";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("refresh-token") {
  constructor(refreshTokenStrategy:RefreshTokenStrategy) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}