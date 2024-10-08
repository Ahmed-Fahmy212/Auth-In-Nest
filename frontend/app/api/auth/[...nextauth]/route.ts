import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "../../../../lib/Constants";
import NextAuth from "next-auth";
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: "Username", type: "text", placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;
                const { username, password } = credentials;
                const res = await fetch(Backend_URL + 'auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                })
                if (res.status == 401) {
                    console.log(res.statusText);
                    return null;
                }
                const user = await res.json();
                return user;
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };

            // if (new Date().getTime() < token.data.tokens.expiresIn)
            return token;

            // return await refreshToken(token);
        },

        async session({ session, token }) {
            session.user = token.user;
            session.tokens = token.tokens;

            return session;
        },
    },
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };