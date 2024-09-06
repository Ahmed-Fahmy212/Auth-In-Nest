import { Injectable, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginBodyDto } from './dto/login.dto';
import { RegisterBodyDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private userService: UsersService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
    }
    // login
    public async validateUser(loginBodyDto: LoginBodyDto): Promise<User> {
        try {
            const user = await this.userRepository.createQueryBuilder('user')
                .where('user.username = :username', { username: loginBodyDto.username })
                .getOneOrFail();
            //! test this or if(!user) throw new UnauthorizedException('Incorrect Username or Password');
            // compare password
            await User.comparePassword(loginBodyDto.password, user);

            return user;
        }
        catch (error) {
            throw new UnauthorizedException('Incorrect Username or Password');
        }
    }
    // register
    public async register(registerBodyDto: RegisterBodyDto): Promise<User> {
        const user = await this.userService.findByUsernameOrFail(registerBodyDto.username); //! check this failer
        if (user) {
            throw new UnauthorizedException('Username already exists');
        }
        const insertedUser = await this.userService.create(registerBodyDto);
        if (!insertedUser) {
            throw new UnauthorizedException('User not registered');
        }
        return insertedUser;
    }

    // sign jwt access token
    public async signJwtAccessToken(user: Partial<User>): Promise<string> {

        return await this.generateJwtToken(user,
            this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),

        );
    }
    public async signJwtRefreshToken(user: Partial<User>): Promise<string> {

        return await this.generateJwtToken(
            user,
            this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
        );
    }
    /////////////////////////////////////////////////////////////////////////////////
    private async generateJwtToken(user: Partial<User>, secret: string, expiresIn: string): Promise<string> {
        try {
            //! is this await useless ? 
            return await this.jwtService.signAsync({ ...user }, { secret, expiresIn })
        } catch (error) {
            throw new ServiceUnavailableException(`Error generating token: ${error.message}`);
        }
    }

    /////////////
    
    ////////////////////////////////////////////////////////////////////

}


