export interface ICreateRefreshTokenVerification {
    userId: string;
    token: string;
    expiration: Date;
}
export interface IUpdateRefreshTokenVerification {
    id: string;
    userId?: string;
    token?: string;
    expiration?: Date;
}