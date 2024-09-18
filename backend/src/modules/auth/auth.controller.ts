import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,

} from '@nestjs/common';
import { Response } from 'express';

import { RegisterBodyDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CookieService } from 'src/utils/RefreshToken';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly cookieService: CookieService,
    ) { }

    @Post('/register')
    public async register(
        @Res() response: Response, @Body() registerBodyDto: RegisterBodyDto,
    ) {
        const user = await this.authService.register(registerBodyDto);
        const accessToken = await this.authService.signJwtAccessToken(user)
        const refreshToken = await this.authService.signJwtRefreshToken(user);

        await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);
        await this.authService.generateEmailVerification(user.email);
        return { username: user.username, accessToken: accessToken };
        response.send({ username: user.username, accessToken: accessToken });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @UseGuards(LocalAuthGuard) // want apply best parctice here
    @Post('/login')
    public async login(@AuthUser() user: User, @Res() response: Response) {
        const accessToken = await this.authService.signJwtAccessToken(user)
        const refreshToken = await this.authService.signJwtRefreshToken(user);//!don`t forget thest this refresh token 

        this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);
        return { username: user.username, accessToken: accessToken };
        response.send({ username: user.username, accessToken: accessToken });
    }

    @Post('verify-email')
    async verifyEmail(@Body("emailToken") token: string) {
        return await this.authService.verifyEmail(token);
    }

}

