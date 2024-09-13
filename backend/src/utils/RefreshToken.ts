import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


export class CookieService  {
    constructor(private readonly configService: ConfigService,) { }
    public async setRefreshTokenToHttpOnlyCookie(response: Response, refreshToken: string) {
        try {
            console.log('💛💛');
            console.log('💛💛Setting cookie with options:', {
                httpOnly: true,
                maxAge: this.configService.get<number>('MAX_AGE_REFRESH_TOKEN_IN_HTTP'),
                path: '/',
                secure: this.configService.get<boolean>('REFRESH_TOKEN_COOKIE_SECURE'),
                sameSite: 'strict',
            });
            response.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: this.configService.get('MAX_AGE_REFRESH_TOKEN_IN_HTTP'), // 7 days
                path: '/',//!
                secure: this.configService.get<boolean>('REFRESH_TOKEN_COOKIE_SECURE'),
                sameSite: 'strict',
            });
        } catch (error) {
            throw new ServiceUnavailableException('Refresh token cookie not set');
        }
    }
}