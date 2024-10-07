import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt , Strategy } from 'passport-jwt';
// will changed
interface JwtPayload {
    username: string;
    iat: number;
    exp: number;
    sub:string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy (Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }
    //TODO: more data will inserted here + removing any 
    validate(payload: any) {
        console.log('Validating JWT payload:', payload);
        return payload;
    }
}
