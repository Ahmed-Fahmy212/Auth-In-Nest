import { IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    verificationCode: string;
}