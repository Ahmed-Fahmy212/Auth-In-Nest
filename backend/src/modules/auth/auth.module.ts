
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { CookieService } from 'src/utils/RefreshToken';
import { EmailVerificationRepository } from './repositories/emailVerification.repository';
import { Nodemailer } from '@crowdlinker/nestjs-mailer';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, LocalStrategy, LocalAuthGuard, CookieService, EmailVerificationRepository],
    controllers: [AuthController],
})
export class AuthModule { }