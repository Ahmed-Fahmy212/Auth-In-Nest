import { Injectable, UnauthorizedException, ServiceUnavailableException, Inject, forwardRef, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginBodyDto } from './dto/login.dto';
import { RegisterBodyDto } from './dto/register.dto';
import { EmailVerificationRepository } from './repositories/emailVerification.repository';
import { ICreateEmailVerification } from './interfaces/create-email-verification.interface';
import { ResetPasswordDto } from './dto/resetPassword.dto';
// import { ForgottenPassword } from '../users/entities/forgotten-password.entity';
import { Response } from 'express';
import { Nodemailer, NodemailerDrivers } from '@crowdlinker/nestjs-mailer';
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        private readonly jwtService: JwtService,
        private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
        private readonly configService: ConfigService,
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
            sub: user.id,
            role: user.role,
        }
        return await this.generateJwtToken(signedAccessToken,
            this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),

        );
    }
    public async signJwtRefreshToken(user: Partial<User>): Promise<string> {
        const signedRefreshToken = {
            sub: user.id,
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
        await this.sendEmailVerificationRequest(email);

        return createdEmailVerifyCode;
    }

    ////////////////////////////////////////////////////////////////////
    public async verifyEmail(token: string): Promise<User> {
        const emailVerificationData = await this.emailVerificationRepository.getEmailVerificationData({ emailToken: token });
        if (!emailVerificationData || !emailVerificationData.email) throw new BadRequestException("invalid email token, please send valid one");
        // check if EmailVerification Expired or not
        const currentTime = new Date();
        const timestamp = new Date(emailVerificationData.timestamp);

        const timeDifferenceInMinutes = (currentTime.getTime() - timestamp.getTime()) / (1000 * 60);
        if (timeDifferenceInMinutes > 10) throw new BadRequestException('Verification code has expired.');


        const userData: User = await this.usersService.getUserByEmail(emailVerificationData.email);
        if (!userData) throw new UnauthorizedException('User not found');
        if (userData.isEmailVerified) throw new UnauthorizedException('Email already verified');

        await this.usersService.makeUserVerified(userData.id);

        await this.deleteEmailVerificationById(emailVerificationData.id);
        userData.isEmailVerified = true;
        return userData;
    }
    //////////////////////////////////////////////////////////////////
    public async refreshToken(response: Response, user: Partial<User>) {
        try {
            const newRefreshToken = await this.signJwtRefreshToken(user);
            const expiresIn = new Date(new Date().getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')) * 60000)
            await this.usersService.updateRefreshToken(user.id, newRefreshToken, expiresIn);
            const newAccessToken = await this.signJwtAccessToken(user);
            // await this.cookieService.setRefreshTokenToHttpOnlyCookie(response, newRefreshToken);

            return response.send({
                data: {
                    newRefreshToken,
                    newAccessToken,
                    expiresIn
                }
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

        const existingForgottenPassword = await this.emailVerificationRepository.getEmailVerificationData({ email });
        if (existingForgottenPassword) {
            throw new BadRequestException('A password reset request already exists for this email');
        }
        const createEmailVerificationPayload: ICreateEmailVerification = {
            email,
            emailToken,
            timestamp: new Date()
        };
        const createdEmailVerifyCode = await this.emailVerificationRepository.createEmailVerification(createEmailVerificationPayload);
        if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');
        const content = `Press here to reset your password `;
        await this.sendEmailVerificationRequest(email, content);
        return createdEmailVerifyCode.raw;
    }
    //////////////////////////////////////////////////////////////////
    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
        const { email, currentPassword, newPassword } = resetPasswordDto;
        let userData: User | null = null;
        const forgottenPassword = await this.emailVerificationRepository.getEmailVerificationData({ email: email });
        if (!forgottenPassword) {
            throw new NotFoundException('This token does not exist');
        }
        userData = await this.usersService.getUserByEmail(email);
        if (!userData) {
            throw new NotFoundException(`This user does not exist`);
        }
        const isValidPassword = await User.comparePassword(currentPassword, userData);
        if (!isValidPassword) {
            throw new BadRequestException("The current password is incorrect");
        }

        const encryptedPassword = newPassword; // will be encrypted in entity class.
        const updateResult = await this.usersService.editUserPassword(email, encryptedPassword);
        await this.usersService.updateRefreshToken(userData.id, '', new Date());
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
    public async sendEmailVerificationRequest(email: string, emailToken?: string, content?: string): Promise<string> {
        if (!emailToken)
            emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();

        const url = `<a style="text-decoration: none" href= "http://${this.configService.get<string>('FRONTEND_URL_HOST')}/#/${this.configService.get('FRONTEND_URL_VERIFY_CODE')}/${emailToken}">Click Here To Confirm Your Email</a>`;

        if (!content) content = `Thanks for registration please verify your email`
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Email must be a valid @gmail.com address');
        }
        const sendMailPayload = {
            from: "Ahmed-fahmy <ahmedfahmy212@gmail.com>",
            to: `${email}`,
            subject: "Verify Email",
            text: "Verify Email",
            html: `Hi <br><br> ${content} <h3></h3>
                ${url}`
        };
        const sendMail = await this.nodeMailerService.sendMail(sendMailPayload);
        if (!sendMail) throw new BadRequestException('Email not sent');
        return "email verification code sent successfully";
    }
    //////////////////////////////////////////////////////////////////

    // public async clearRefreshTokenCookie(response: Response, userId: string) {
    //     try {
    //         //TODO handle in frontend
    //         //  response.clearCookie('refresh_token', {
    //         //     httpOnly: true,
    //         //     path: '/',
    //         //     secure: false,
    //         //     sameSite: 'strict',
    //         await this.usersService.updateRefreshToken(userId, '', new Date());

    //     } catch (error) {
    //         throw new ServiceUnavailableException('Refresh token cookie not cleared');
    //     }
    // }
    ////////////////////////////////////////////////////////////////////

    public async handleTokenGeneration(user: User) {

        const accessToken = await this.signJwtAccessToken(user);
        const refreshToken = await this.signJwtRefreshToken(user);
        await this.updateRefreshToken(user, refreshToken);
        //TODO is this ok to handled in front ?
        // await this.cookieService.setRefreshTokenToHttpOnlyCookie(refreshToken);

        return { accessToken, refreshToken };
    }

    ////////////////////////////////////////////////////////////////////
    public async updateRefreshToken(user: Partial<User>, refreshToken: string) {
        const expiration = new Date(new Date().getTime() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')) * 60000);
        await this.usersService.updateRefreshToken(user.id, refreshToken, expiration);
    }
    //////////////////////////////////////////////////////////////////
    public async createResponseData(user: User, tokens: { accessToken: string; refreshToken: string }) {
        const accessTokenExpiration = this.configService.get<string>("JWT_ACCESS_EXPIRATION_TIME");
        // const expiresInMilliseconds = this.convertToMilliseconds(accessTokenExpiration);
        const expiresInMilliseconds = parseInt(accessTokenExpiration) * 60000;
        return {
            data: {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    expiresIn: expiresInMilliseconds
                }
            }
        };
    }
    ////////////////////////////////////////////////////////////////////
    // private convertToMilliseconds(time: string): number {
    //     const timeValue = parseInt(time.slice(0, -1));
    //     const timeUnit = time.slice(-1);

    //     switch (timeUnit) {
    //         case 's':
    //             return timeValue * 1000;
    //         case 'm':
    //             return timeValue * 60 * 1000;
    //         case 'h':
    //             return timeValue * 60 * 60 * 1000;
    //         case 'd':
    //             return timeValue * 24 * 60 * 60 * 1000;
    //         default:
    //             throw new Error('Invalid time format');
    //     }
    // }

}




