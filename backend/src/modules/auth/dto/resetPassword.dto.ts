export class ResetPasswordDto {
    readonly email: string;
    readonly newPassword: string;
    readonly currentPassword: string;
}