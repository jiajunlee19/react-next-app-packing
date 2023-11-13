import SignUpComponent from "@/app/(pages)/auth/signUp/component";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Developed by jiajunlee',
};

export default function SignUpPage() {
    return <SignUpComponent />
};