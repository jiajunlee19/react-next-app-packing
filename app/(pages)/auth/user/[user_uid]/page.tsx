import type { Metadata } from 'next';
import UserComponent from '@/app/(pages)/auth/user/[user_uid]/component';

export const metadata: Metadata = {
    title: 'User',
    description: 'Developed by jiajunlee',
};

export default function UserPage({ params }: { params: {user_uid: string} }) {
    return <UserComponent params={params} />
};