import { GeneralEntity } from "shared/database/GeneralEntity";
import {Unique, Column, Entity} from "typeorm";

@Entity('forgotten-passwords')
@Unique(['email', 'newPasswordToken'])
export class ForgottenPassword extends GeneralEntity {
    @Column()
    email: string;

    @Column()
    newPasswordToken: string;
}
