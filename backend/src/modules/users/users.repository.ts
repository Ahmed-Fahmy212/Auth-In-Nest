import { HttpException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Request } from 'express';
import { BaseRepository } from 'src/common/base-repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

import { REQUEST } from '@nestjs/core';
@Injectable()
export class UsersRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    public async findByUsername(username: string): Promise<User> {
        const queryBuilder = this.getRepository(User).createQueryBuilder('user');
        return await queryBuilder.where('user.username = :username', { username }).getOne();
    }
    public async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.getRepository(User).create({
            username: createUserDto.username,
            password: createUserDto.password,
            email: createUserDto.email,
        });
        const createdUser = await this.getRepository(User).save(user);
        return createdUser;
    }
    public async getUserByEmail(email: string): Promise<User> {
        return this.getRepository(User).findOne({ where: { email: email.toString().trim() } });
    }
    public async makeUserVerified(userId: string) {
        return this.getRepository(User).update(userId, { isEmailVerified: true });
    }
    public async editUserPassword(email: string, newPassword: string) {
        const queryBuilder = this.getRepository(User).createQueryBuilder('user');
        return await queryBuilder
            .update(User)
            .set({ password: newPassword })
            .where('user.email = :email', { email })
            .execute();
    }
}