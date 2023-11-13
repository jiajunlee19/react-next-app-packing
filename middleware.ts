// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { parsedEnv } from "@/app/_libs/zod_env";
import { verifyJwtToken } from "@/app/_libs/jwt";

// export { default } from "next-auth/middleware";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(request: NextRequestWithAuth) {
        // console.log(request.nextUrl.pathname)
        // console.log(request.nextauth.token)

        // const jwtToken = request.headers.get("jwtToken");
        // if (!jwtToken || !verifyJwtToken) {
        //     return new NextResponse(JSON.stringify({error: "Unauthorized!"}), {status: 401})
        // }

        if (request.nextUrl.pathname.startsWith("/protected")
            && request.nextauth.token?.role !== "admin"
            && request.nextauth.token?.role !== "boss")
        {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }

        if (request.nextUrl.pathname.startsWith("/restricted")
            && request.nextauth.token?.role !== "boss") {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }
    },
    {
        secret: parsedEnv.NEXTAUTH_SECRET,
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/protected/:path*", "/restricted/:path*"] }