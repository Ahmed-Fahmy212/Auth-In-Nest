import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
