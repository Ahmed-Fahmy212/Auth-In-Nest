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
import { ForgottenPassword } from './repositories/forgotten-password.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private readonly emailVerificationRepository: EmailVerificationRepository,
        // private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
        private readonly jwtService: JwtService,
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
        console.log('💛💛 insertedUser', insertedUser)
        if (!insertedUser) {
            throw new UnauthorizedException('User not registered');
        }
        return insertedUser;
    }
    /////////////////////////////////////////////////////////////////////////////////
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
    private async generateJwtToken(user: Partial<User>, secret: string, expiresIn: string): Promise<any> {
        try {
            return await this.jwtService.signAsync({ ...user }, { secret, expiresIn })
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
    public async refreshToken(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });
        const user = await this.usersService.findByUsername(payload.username);
        return await this.signJwtAccessToken(user);
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
        //     from: "Ahmed-Shabana <ahmedshabana646@gmail.com>",
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




