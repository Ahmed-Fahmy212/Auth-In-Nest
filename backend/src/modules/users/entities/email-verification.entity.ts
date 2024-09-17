import { Unique, Column, Entity } from "typeorm";
import { GeneralEntity } from "../../../../shared/database/GeneralEntity";

@Entity("verified_emails")
@Unique(["email", "emailToken"])
export class EmailVerification extends GeneralEntity {
  @Column()
  email: string;

  @Column()
  emailToken: string;

  @Column()
  timestamp: Date;
}