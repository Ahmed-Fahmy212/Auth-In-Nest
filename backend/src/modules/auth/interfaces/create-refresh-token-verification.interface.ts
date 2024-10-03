export interface ICreateRefreshTokenVerification {
    userId: string;
    token: string;
    expiration: Date;
    tokenVersion?: number;
    isRevoked?: boolean;
}