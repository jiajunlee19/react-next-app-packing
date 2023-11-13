import SignInComponent from "@/app/(pages)/auth/signIn/component";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Developed by jiajunlee',
};

export default function SignInPage() {
    return <SignInComponent />
};