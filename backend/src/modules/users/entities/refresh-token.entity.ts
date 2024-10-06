// import { GeneralEntity } from 'shared/database/GeneralEntity';
// import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

// @Entity()
// @Index(['userId'])
// export class RefreshToken {
//     @PrimaryGeneratedColumn("uuid")
//     id: string;

//     @Column({ unique: true })
//     token: string;

//     @Column()
//     ipAddress : string;

//      @Column()
//     userAgent : string;

//     @Column({default: false})
//     isRevoked: boolean;

//     @Column()
//     revokedAt: Date;

//     @Column({default: 1})
//     version: number;

//     @Column()
//     expiration: Date;
// }
