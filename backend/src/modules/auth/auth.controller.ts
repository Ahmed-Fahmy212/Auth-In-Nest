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

        const accessToken = await this.authService.signJwtAccessToken(user);
        const refreshToken = await this.authService.signJwtRefreshToken(user);
        await this.authService.storeRefreshToken(user.id, refreshToken);
        await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);
        // await this.authService.generateEmailVerification(user.email);
        response.send({ data: { username: user.username, accessToken: accessToken, refreshToken: refreshToken } });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(@AuthUser() user: User, @Res() response: Response) {
        const accessToken = await this.authService.signJwtAccessToken(user)
        const refreshToken = await this.authService.signJwtRefreshToken(user);
        await this.authService.storeRefreshToken(user.id, refreshToken);

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
        return this.authService.sendEmailVerificationRequest(email);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Post('refresh-token')
    async refreshToken(@Req() request, @Res() response: Response) {
        const refreshToken = request.cookies?.refresh_token;
        if (!refreshToken) {
            throw new BadRequestException('Invalid token');
        }
        const user = request.user;
        console.log("💛💛💛user", user);
        if (!user) {
            throw new BadRequestException('[USER] Invalid token');
        }

        return await this.authService.refreshToken(response, refreshToken, user);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Get('me')
    async me(@AuthUser() user: User) {
        return user;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Get('forgot-password')
    async forgotPassword(@Body("email") email: string) {
        //TODO: remove refresh token and 
        return await this.authService.forgotPassword(email);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    @Protected()
    @Post('logout')
    //TODO: remove refresh token and 
    async logout(@Res() response: Response) {
        return 'ok';
    }
}

