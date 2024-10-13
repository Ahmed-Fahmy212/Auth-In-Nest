import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { concatMap, from, lastValueFrom, of, throwError } from "rxjs";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-token") {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            ignoreExpiration: false, //TODO make this renewavble permentant 
            passReqToCallback: true 
        });
    }

    async validate(request: Request, payload: Record<string, any>) {
        const { sub } = payload;
        const refreshToken = request.cookies.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found, please log in again.');
        }
        const userData = await this.userService.findById(sub);

        if (!userData) {
            throw new UnauthorizedException();
        } else if (userData.refreshToken !== refreshToken) {
            throw new UnauthorizedException();
        } else if (new Date() > new Date(userData.refreshTokenExpiration)) {
            throw new UnauthorizedException();
        }
        // is this ok ?
        const refreshTokenData = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });

        if (refreshTokenData.sub !== userData.id) {
            throw new BadRequestException('Invalid tokens provided, please login again.');
        }
        return userData;
    }
}

