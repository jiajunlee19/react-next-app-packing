import type { Metadata } from 'next';
import UserComponent from '@/app/(pages)/auth/user/[user_uid]/component';

export const metadata: Metadata = {
    title: 'User',
    description: 'Developed by jiajunlee',
};

export default async function UserPage(props: { params: Promise<{user_uid: string}> }) {
    const params = await props.params;
    return <UserComponent params={params} />
};