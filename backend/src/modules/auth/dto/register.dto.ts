import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsEnum } from 'class-validator';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}
export class RegisterBodyDto {
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole ;
}
