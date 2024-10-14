import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "../../../../lib/Constants"; // Ensure this imports the correct URL
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin")
// if (isDefaultSigninPage) providers.pop()
// async function refreshToken(token: JWT): Promise<JWT> {
//     const res = await fetch(Backend_URL + "auth/refresh-token", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token.tokens.refreshToken}`,
//         },
//     });
//     console.log("refreshed");
//     const response = await res.json();
//     console.log("💛💛💛refreshed :", response, token);
//     //TODO HAndle this 
//     return {
//         ...token,
//         tokens: response,
//     };
// }
export const authOptions: NextAuthOptions = {
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
                if (!credentials?.username || !credentials?.password) {
                    console.log("💛credentials ", null)
                    return null;
                }

                const { username, password } = credentials;

                try {
                    const res = await fetch(`http://localhost:8000/v1/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });


                    console.log("💛💛💛Error res :", res.status, res.body);
                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error(`Error: ${errorData.message}`);
                        return null;
                    }

                    const user = await res.json();

                    const extendedUser = {
                        ...user.data,
                        sub: user.data.id,
                    };
                    return extendedUser;

                } catch (error) {
                    console.error('Fetch error:', error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: User }) {
            if (user) {
                return { ...token, ...user }
            }
            // if (new Date() < new Date(token?.tokens.expiresIn))
            return token;

            // return await refreshToken(token);
        },
        async session({ token,   }) {

            session.user = {
                id: token.sub as string,
                name: token.name as string,
                email: token.email as string,
            };
            session.accessToken = token.tokens.accessToken;
            session.expires = new Date(token.tokens.expiresIn).toISOString();


            console.log("💛💛 session:", session);
            console.log("-----------------------------------------");

            return session;
        },
    }
    // , pages: {
    //     signIn: '/login',
    //     signOut: '/logout',
    // error: '/login',
    // verifyRequest: '/verify-request',
    //   },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
