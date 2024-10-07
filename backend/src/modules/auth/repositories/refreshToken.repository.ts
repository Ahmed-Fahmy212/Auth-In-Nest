// import { Inject } from "@nestjs/common";
// import { REQUEST } from "@nestjs/core";
// import { BaseRepository } from "src/common/base-repository";
// import { RefreshToken } from "src/modules/users/entities/refresh-token.entity";
// import { DataSource } from "typeorm";
// import { Request } from 'express';
// import { ICreateRefreshTokenVerification, IUpdateRefreshTokenVerification } from "../interfaces/create-refresh-token-verification.interface";
// export class RefreshTokenRepository extends BaseRepository {
//     constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
//         super(dataSource, req);
//     }
//     async delete(arg: { expiration: import("typeorm").FindOperator<Date>; }) {
//         return await this.getRepository(RefreshToken).delete(arg);
//     }
//     async save(data: ICreateRefreshTokenVerification) {
//         return await this.getRepository(RefreshToken).save(data);
//     }
//     async findOne(userId: string) {
//         return await this.getRepository(RefreshToken).findOne({ where: { userId:userId } });
//     }
//     async update(data: IUpdateRefreshTokenVerification) {
//         return await this.getRepository(RefreshToken).save(data);
//     }
// }   