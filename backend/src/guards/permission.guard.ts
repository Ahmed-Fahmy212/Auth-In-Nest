import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { Transaction } from "src/interceptors/transaction.interceptor";
import { User } from "src/modules/users/entities/user.entity";
import { DataSource, EntityManager } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private datasource: DataSource,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("💛PermissionGuard");
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const [, token] = authHeader.split(' ');

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }
        try {
            const secretKey = this.configService.get<string>('JWT_SECRET');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });

            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTimestamp) {
                throw new UnauthorizedException('token has expired');
            }
            //TODO: why trx not working here
            const entityManager = request[Transaction]||this.datasource.manager;
            const foundUser = await entityManager.getRepository(User).findOneOrFail({
                where: { username: payload.username },
                select: ['id', 'username', 'email', 'isEmailVerified', 'isSuperAdmin']
            });
            if (!foundUser) {
                throw new UnauthorizedException('User not found');
            }
            if (foundUser.isSuperAdmin){
                return true;
            }
            //TODO: add here role and return false 
            request['user'] = foundUser;
            return true;

        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid token login again ...');
        }
    }

}
