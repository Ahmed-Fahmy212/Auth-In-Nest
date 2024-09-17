
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

@Entity()
@Index(['username', 'email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    public async hashPasswordBeforeInsert(): Promise<void> {
        if (this.password) {
            this.password = await User.hashPassword(this.password);
        }
    }
    //////////////////////////////////////////////////////////////////////
    private static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (error, salt) => {
                if (error) {
                    reject(error);
                }
                bcrypt.hash(password, salt, (error, hash) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(hash);
                });
            });
        });
    }
    //////////////////////////////////////////////////////////////////////
    public static async comparePassword(
        password: string,
        user: User,
    ): Promise<boolean> {
        try { //! what other ways to crypt password?
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new UnauthorizedException('Incorrect Username or Password !');
            }

            return match;
        } catch (error) {
            throw error;
        }
    }
}
