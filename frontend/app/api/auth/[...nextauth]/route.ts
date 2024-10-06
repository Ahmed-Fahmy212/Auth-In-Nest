import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiHandler } from "next";

// wnat add full auth with oauth
// want add session m,anagment 
// want add admin and subadmins 
// socket io chat 
const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // Add more providers here
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async session(session: any, user: any) {
            session.user.id = user.id;
            return session;
        },
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
        verifyRequest: '/auth/verify-request',
        newUser: null,
    },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;