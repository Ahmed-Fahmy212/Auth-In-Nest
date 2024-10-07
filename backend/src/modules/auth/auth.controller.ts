import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,

} from '@nestjs/common';
import { Response } from 'express';

import { RegisterBodyDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { CookieService } from 'src/utils/RefreshToken';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Protected } from 'src/decorators/protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly cookieService: CookieService,
        private readonly configService: ConfigService
    ) { }

    @Post('/register')
    public async register(
        @Res() response: Response, @Body() registerBodyDto: RegisterBodyDto,
    ) {
        const user = await this.authService.register(registerBodyDto);

        const accessToken = await this.authService.signJwtAccessToken(user);
        const refreshToken = await this.authService.signJwtRefreshToken(user);
        const expiration = new Date(new Date().getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')) * 60000);
        await this.authService.updateRefreshToken(user, refreshToken, expiration);
        await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);
        await this.authService.generateEmailVerification(user.email);

        response.send({ data: { username: user.username, accessToken: accessToken, refreshToken: refreshToken } });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(@AuthUser() user: User, @Res() response: Response) {
        const accessToken = await this.authService.signJwtAccessToken(user)
        const refreshToken = await this.authService.signJwtRefreshToken(user);
        const expiration = new Date(new Date().getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')) * 60000);
        await this.authService.updateRefreshToken(user, refreshToken, expiration);
        await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);

        response.send({ data: { username: user.username, accessToken: accessToken, refreshToken: refreshToken } });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Post('verify-email')
    async verifyEmail(@Body("emailToken") token: string) {
        return await this.authService.verifyEmail(token);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Post("send-email-verification")
    sendEmailVerification(@Body("email") email: string) {
        return this.authService.sendEmailVerificationRequest(email, null);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    async refreshToken(@Req() request: Request, @Res() response: Response) {
        console.log('💛💛 refresh token service')
        const user = request.user;
        return await this.authService.refreshToken(response, user)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Get('me')
    async me(@AuthUser() user: User) {
        return user;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Post('forgot-password')
    async forgotPassword(@Body("email") email: string) {
        return await this.authService.forgotPassword(email);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Post('logout')
    async logout(@Req() request, @Res() response: Response) {
        const user = request.user.id;
        await this.authService.clearRefreshTokenCookie(response, user);
        return 'ok';
    }
}

