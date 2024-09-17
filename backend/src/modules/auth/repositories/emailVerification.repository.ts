import { BaseEntity, DataSource, Repository } from "typeorm";
import { Injectable, Inject } from "@nestjs/common";
import { EmailVerification } from "src/modules/users/entities/email-verification.entity";
import { BaseRepository } from "src/common/base-repository";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { IFilterEmailVerification } from "../interfaces/filter-email-verification.interface";
import { ICreateEmailVerification } from "../interfaces/create-email-verification.interface";

@Injectable()
export class EmailVerificationRepository extends BaseRepository {

  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  public async getEmailVerificationData(payload: IFilterEmailVerification) {
    return await this.getRepository(EmailVerification)
      .createQueryBuilder('emailVerification')
      .where('emailVerification.email = :email', { email: payload.email }).getOne();
  }

  public async createEmailVerification(payload: ICreateEmailVerification) {
    return await this.getRepository(EmailVerification)
      .createQueryBuilder('emailVerification')
      .insert()
      .values(payload)
      .execute();
  }


}
