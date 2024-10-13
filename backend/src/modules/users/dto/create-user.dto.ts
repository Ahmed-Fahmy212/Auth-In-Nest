import { UserRole } from "src/modules/auth/dto/register.dto";

export class CreateUserDto {
    username: string;
    password: string;
    email: string;
    role?: UserRole;
}
