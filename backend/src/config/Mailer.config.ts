import { NodemailerModule } from '@crowdlinker/nestjs-mailer';
import { NodemailerOptions, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerConfig {
    static getConfig(configService: ConfigService): NodemailerOptions<NodemailerDrivers.SMTP> {
        return {
            transport: {
                host: configService.get<string>('MAILER_TRANSPORT_HOST'),
                port: configService.get<number>('MAILER_TRANSPORT_PORT'),
                secure: true,
                auth: {
                    user: configService.get<string>('MAILER_TRANSPORT_USER'),
                    pass: configService.get<string>('MAILER_TRANSPORT_PASSWORD'),
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            defaults: {},
        };
    }
}
