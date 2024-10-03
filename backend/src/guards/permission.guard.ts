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
        private jwtService: JwtService,
        private configService: ConfigService,
        private request: Request,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("💛PermissionGuard");
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }


        const [, token] = authHeader.split(' ');

        if (!token) {
            throw new UnauthorizedException('Token missing');
        }
        // connection to the database to check if the user is a super admin
        const entityManager = this.request[Transaction].manager;
        console.log("💛 req", request);
        console.log("💛 req.user", request.user);
        const foundUser = await entityManager
            .createQueryBuilder(User, 'user')
            .where('user.username = :username', { username: request.user })
            .getOne();

        if (!foundUser) {
            throw new UnauthorizedException('User not found');
        }
        try {
            const secretKey = this.configService.get<string>('JWT_SECRET');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });

            if (foundUser.isSuperAdmin) { return true; }
            //! date handle 
            // if (payload.iat >)

        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
