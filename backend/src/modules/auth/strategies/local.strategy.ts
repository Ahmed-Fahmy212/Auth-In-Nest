import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { LoginBodyDto } from "../dto/login.dto";
import { User } from "src/modules/users/entities/user.entity";
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({});
  }

  async validate(username: string , password:string): Promise<User> {
    const user = await this.authService.validateUser({username, password});
    if (!user) throw new BadRequestException('Wrong username or password ...');
    return user;
  }
}

