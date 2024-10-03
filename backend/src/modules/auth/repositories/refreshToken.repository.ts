import { Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { BaseRepository } from "src/common/base-repository";
import { RefreshToken } from "src/modules/users/entities/refresh-token.entity";
import { DataSource } from "typeorm";
import { Request } from 'express';
import { ICreateRefreshTokenVerification } from "../interfaces/create-refresh-token-verification.interface";

export class RefreshTokenRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }
    async save(data: ICreateRefreshTokenVerification) {
        return await this.getRepository(RefreshToken).save(data);
    }
}   