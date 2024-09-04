import { IsString, IsNotEmpty } from 'class-validator';
import {Exclude,Expose} from 'class-transformer';

@Exclude()
export class LoginBodyDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

}