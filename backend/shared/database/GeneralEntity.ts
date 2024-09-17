import { BaseEntity, PrimaryGeneratedColumn ,CreateDateColumn , UpdateDateColumn} from "typeorm";

export class GeneralEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}