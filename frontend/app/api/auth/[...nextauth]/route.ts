import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Backend_URL } from "../../../../lib/Constants"; // Ensure this imports the correct URL
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
                
                try {
                    const res = await fetch(`${Backend_URL}/v1/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });

                    // Check if the response is ok
                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error(`Error: ${errorData.message}`);
                        return null; // User authorization failed
                    }

                    const user = await res.json(); // Get the user object from response
                    console.log("User authenticated:", user);
                    return user; // Return the user object

                } catch (error) {
                    console.error('Fetch error:', error);
                    return null; // Return null on error
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log("💛💛 token :", token);
            console.log("💛💛 user :", user);
            if (user) return { ...token, ...user };
            return token;
        },
        async session({ session, token }) {
            console.log("💛💛 session :", session);
            session.user = token.user || {};
            session.tokens = token.tokens;
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
