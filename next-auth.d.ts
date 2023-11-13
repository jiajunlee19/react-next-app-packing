// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            user_uid: string,
            email: string,
            // password: string,
            role: "user" | "admin" | "boss",
            jwtToken: string,
        } 
        // & DefaultSession
    }

    interface User 
    // extends DefaultUser 
    {
        user_uid: string,
        email: string,
        // password: string,
        role: "user" | "admin" | "boss",
        jwtToken: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT 
    // extends DefaultJWT 
    {
        user_uid: string,
        email: string,
        // password: string,
        role: "user" | "admin" | "boss",
        jwtToken: string,
    }
}