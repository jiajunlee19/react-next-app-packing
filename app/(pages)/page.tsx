import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Home',
    description: 'Developed by jiajunlee',
};

export default async function Home() {

    const session = await getServerSession(options);

    return (
        <>
            <h1>Home</h1>
            <p>Welcome to Packing App !</p>
            {!session?.user.role ? 
                <p>You are logged in as Guest and may have access to view public contents only.</p> 
                : 
                <p>You are logged in as {session.user.role}.</p>
            }
        </>
    )
};