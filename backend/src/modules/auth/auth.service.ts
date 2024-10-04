import { Injectable, UnauthorizedException, ServiceUnavailableException, Inject, forwardRef, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginBodyDto } from './dto/login.dto';
import { RegisterBodyDto } from './dto/register.dto';
import { EmailVerificationRepository } from './repositories/emailVerification.repository';
import { ICreateEmailVerification } from './interfaces/create-email-verification.interface';
import { Nodemailer, NodemailerDrivers } from "@crowdlinker/nestjs-mailer";
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ForgottenPassword } from '../users/entities/forgotten-password.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { ICreateRefreshTokenVerification } from './interfaces/create-refresh-token-verification.interface';
import { isEmail } from 'class-validator';
import { Response } from 'express';
import { CookieService } from 'src/utils/RefreshToken';
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly jwtService: JwtService,
        // private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
    ) { }
    /////////////////////////////////////////////////////////////////////////////////
    public async validateUser(loginBodyDto: LoginBodyDto): Promise<User> {
        try {
            const foundUser = await this.usersService.findByUsername(loginBodyDto.username);
            if (!foundUser) throw new UnauthorizedException('Incorrect Username or Password');
            // compare password
            await User.comparePassword(loginBodyDto.password, foundUser);
            return foundUser;
        }
        catch (error) {
            throw new UnauthorizedException('Incorrect Username or Password');
        }
    }
    /////////////////////////////////////////////////////////////////////////////////
    public async register(registerBodyDto: RegisterBodyDto): Promise<User> {
        const user = await this.usersService.findByUsername(registerBodyDto.username);
        if (user) {
            throw new UnauthorizedException('Username already exists');
        }
        const insertedUser = await this.usersService.create(registerBodyDto);
        if (!insertedUser) {
            throw new UnauthorizedException('User not registered');
        }
        return insertedUser;
    }
    /////////////////////////////////////////////////////////////////////////////////
    // sign jwt access token
    public async signJwtAccessToken(user: Partial<User>): Promise<string> {
        const signedAccessToken = {
            username: user.username,
            email: user.email,
        }
        return await this.generateJwtToken(signedAccessToken,
            this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),

        );
    }
    public async signJwtRefreshToken(user: Partial<User>): Promise<string> {
        const signedRefreshToken = {
            username: user.username,
            email: user.email,
            // iat: new Date().getTime(),
            // exp: new Date().setMinutes(new Date().getMinutes() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'))),
        }
        return await this.generateJwtToken(
            signedRefreshToken,
            this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
        );
    }
    /////////////////////////////////////////////////////////////////////////////////
    private async generateJwtToken(data: any, secret: string, expiresIn: string): Promise<any> {
        try {
            return await this.jwtService.signAsync({ ...data }, { secret, expiresIn })
        } catch (error) {
            throw new ServiceUnavailableException(`Error generating token: ${error.message}`);
        }
    }
    ////////////////////////////////////////////////////////////////////
    public async generateEmailVerification(email: string): Promise<any> {
        const emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
        const createEmailVerificationPayload: ICreateEmailVerification = {
            email,
            emailToken,
            timestamp: new Date()
        };
        const createdEmailVerifyCode = await this.emailVerificationRepository.createEmailVerification(createEmailVerificationPayload);
        if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');

        console.log('💛💛 email', email,) //! convert this into sendEmailverify
        await this.sendEmailVerificationRequest(email);
        // console.log('💛💛 Email sent: %s', sendMail.messageId);
        // console.log('💛💛 all data data', emailVerificationCode,
        //     emailToken,
        //     createdEmailVerifyCode,
        //     sendMail
        // )
        return createdEmailVerifyCode;
    }
    ////////////////////////////////////////////////////////////////////
    public async storeRefreshToken(userId: string, token: string) {
        const expiration = new Date();
        const envRefreshTokenTime = this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME');
        expiration.setDate(expiration.getDate() + parseInt(envRefreshTokenTime));
        const data: ICreateRefreshTokenVerification = {
            token,
            userId,
            expiration,
        }
        await this.refreshTokenRepository.save(data);
    }
    ////////////////////////////////////////////////////////////////////
    public async verifyEmail(token: string): Promise<User> {
        const emailVerificationData = await this.emailVerificationRepository.getEmailVerificationData({ email: token });
        if (!emailVerificationData || !emailVerificationData.email) throw new BadRequestException("invalid email token, please send valid one");
        // check isEmailVerificationExpired or not
        const currentTime = new Date();
        const timestamp = new Date(emailVerificationData.timestamp);

        const timeDifferenceInMinutes = (currentTime.getTime() - timestamp.getTime()) / (1000 * 60);
        if (timeDifferenceInMinutes > 10) throw new BadRequestException('Verification code has expired.');


        const userData: User = await this.usersService.getUserByEmail(emailVerificationData.email);
        if (!userData) throw new UnauthorizedException('User not found');
        if (userData.isEmailVerified) throw new UnauthorizedException('Email already verified');

        await this.usersService.makeUserVerified(userData.id);

        await this.deleteEmailVerificationById(emailVerificationData.id);

        return userData;
    }
    //////////////////////////////////////////////////////////////////
    public async refreshToken(response: Response, refreshToken: string, user: Partial<User>) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });
            if (!payload) throw new UnauthorizedException('Invalid token');

            const storedToken = await this.refreshTokenRepository.findOne(payload.userId);
            if (!storedToken) {
                throw new BadRequestException('Refresh token invalid ');
            }
            if (new Date() > storedToken.expiration) {
                throw new BadRequestException('Refresh token is expired');
            }
            if (storedToken.userId !== user.id) {
                throw new BadRequestException('Refresh token is invalid');
            }
            const newRefreshToken = await this.refreshTokenRepository.update(storedToken);
            const newAccessToken = await this.signJwtAccessToken(user);
            await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, refreshToken);

            response.send({
                newRefreshToken,
                newAccessToken,
                expiresIn: new Date().setMinutes(new Date().getMinutes() + parseInt(this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'))),
            })
        }
        catch (error) {
            console.log('error', error)
            throw new UnauthorizedException('Can`t refresh token please login again');
        }
    }
    //////////////////////////////////////////////////////////////////
    public async forgotPassword(email: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');
        const emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
        const createEmailVerificationPayload: ICreateEmailVerification = {
            email,
            emailToken,
            timestamp: new Date()
        };
        const createdEmailVerifyCode = await this.emailVerificationRepository.createEmailVerification(createEmailVerificationPayload);
        if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');

        await this.sendEmailVerificationRequest(email);
        return createdEmailVerifyCode;
    }
    //////////////////////////////////////////////////////////////////
    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
        const { email, newPasswordToken, currentPassword, newPassword } = resetPasswordDto;
        let isNewPasswordChanged = false;
        let encryptedPassword: string;
        let forgottenPassword: ForgottenPassword | null = null;
        let userData: User | null = null;

        userData = await this.usersService.getUserByEmail(email);
        if (!userData) {
            throw new NotFoundException(`This user does not exist`);
        }

        const isValidPassword = await User.comparePassword(currentPassword, userData);
        if (!isValidPassword) {
            throw new BadRequestException("The current password is incorrect");
        }

        const updateResult = await this.usersService.editUserPassword(email, encryptedPassword);
        if (updateResult.affected === 0) {
            throw new ConflictException("There may be an error in the data entered!");
        }

        return "Password updated successfully";

    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    private async deleteEmailVerificationById(id: string) {
        return await this.emailVerificationRepository.deleteForgottenPasswordTokenById(id);
    }
    //////////////////////////////////////////////////////////////////
    public async sendEmailVerificationRequest(email: string) {
        // const url = `<a style="text-decoration: none" href= "http://${this.configService.get<string>('FRONTEND_URL_HOST')}/#/${this.configService.get('FRONTEND_URL_VERIFY_CODE')}/${emailToken}">Click Here To Confirm Your Email</a>`;
        // const sendMailPayload = {
        //     from: "Ahmed-fahmy <ahmedfahmy212@gmail.com>",
        //     to: 'ahmedfahmy212az@gmail.com',
        //     subject: "Verify Email",
        //     text: "Verify Email",
        //     html: `Hi <br><br> <h3>Thanks for registration please verify your email</h3>
        //         ${url}`
        // };
        // const sendMail = await this.nodeMailerService.sendMail(sendMailPayload);
        // if (!sendMail) throw new BadRequestException('Email not sent');
        // return "email verification code sent successfully";
    }


}

////////////////////////////////////////////////////////////////////




