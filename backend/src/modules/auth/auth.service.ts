import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginBodyDto } from './dto/login.dto';
@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private userService: UsersService,

    ) {
    }

    public async validateUser(loginBodyDto: LoginBodyDto): Promise<User> {
        try {
            const user = await this.userService.findByUsernameOrFail(loginBodyDto.username);
            await User.comparePassword(loginBodyDto.password, user);
            return user;
        }
        catch (error) {
            throw new UnauthorizedException('Incorrect Username or Password');
        }
    }

}
