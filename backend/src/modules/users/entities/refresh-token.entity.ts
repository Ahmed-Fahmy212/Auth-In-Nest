import { GeneralEntity } from 'shared/database/GeneralEntity';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['userId'])
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ unique: true })
    token: string;

    @Column()
    userId: string;

    @Column()
    expiration: Date;

    @Column({ default: 1 }) // so revoke all versions in case logout or change password
    tokenVersion: number;

    @Column({ default: false })
    isRevoked: boolean;
}
