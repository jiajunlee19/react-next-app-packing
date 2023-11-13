import type {  NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { parsedEnv } from '@/app/_libs/zod_env';
import { signIn } from '@/app/_actions/auth';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "email",
                    placeholder: "Enter your e-mail",
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Enter your password",
                },
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }

                // for API, use this
                // let res = await fetch(parsedEnv.BASE_URL + "/api/signIn", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({
                //         email: credentials.email,
                //         password: credentials.password,
                //     }),
                // });

                // let user = await res.json();

                const result = await signIn(credentials.email, credentials.password);

                if (!result || "error" in result) {
                    return null
                }

                return result as User;
            }
        })
    ],

    pages: {
        // Define custom page if required
        signIn: '/auth/signIn',
        signOut: '/auth/signOut',
    },

    secret: parsedEnv.NEXTAUTH_SECRET,

    session: {
        strategy: 'jwt',
        maxAge: 2 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },

    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        async jwt({ token, user }) {
            return {...token, ...user}
        },
        // If you want to use the role in client components
        async session({ session, token }) {
            session.user = token;
            return session
        },
    },
};