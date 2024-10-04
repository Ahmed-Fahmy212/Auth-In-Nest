import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "../auth.service";
import { LoginBodyDto } from "../dto/login.dto";
import { User } from "src/modules/users/entities/user.entity";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ username, password } as LoginBodyDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

