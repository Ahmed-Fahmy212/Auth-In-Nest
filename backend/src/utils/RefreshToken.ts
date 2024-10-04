import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


export class CookieService {
    constructor() { }
    public async setRefreshTokenToHttpOnlyCookie(response: Response, refreshToken: string) {
        try {
            response.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 604800000, // 7 days
                path: '/',
                secure: false,
                sameSite: 'strict',
            });
        } catch (error) {
            throw new ServiceUnavailableException('Refresh token cookie not set');
        }
    }
}