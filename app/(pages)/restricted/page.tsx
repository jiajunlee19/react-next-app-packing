import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Restricted',
    description: 'Developed by jiajunlee',
};

export default function RestrictedPage() {

    return (
        <>
            <div className="h-full align-middle flex flex-column items-center justify-center gap-4">
                <span className="font-semibold italic">Restricted Page</span>
                <span>|</span>
                <span className="font-semibold italic" >Access Denied</span>
            </div>
        </>
    );
};