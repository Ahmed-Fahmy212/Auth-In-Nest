import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        data: {
            user: {
                id: string;
                username: string;
                email: string;

            };
            tokens: {
                accessToken: string;
                refreshToken: string;
            }
        }
    }
}