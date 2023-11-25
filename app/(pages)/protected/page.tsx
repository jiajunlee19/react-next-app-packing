import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protected',
    description: 'Developed by jiajunlee',
};

export default function ProtectedPage() {
    return (
        <>
            <div className="h-full align-middle flex flex-column items-center justify-center gap-4">
                <span className="font-semibold italic">Protected Page</span>
                <span>|</span>
                <span className="font-semibold italic" >Access Denied</span>
            </div>
        </>
    );
};