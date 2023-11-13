import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protected',
    description: 'Developed by jiajunlee',
};

export default function ProtectedPage() {
    return (
        <>
            <h1>Protected Page for Admin</h1>
            {/* <nav>
                {authNavLinks.map((link) => {
                    return (
                        <li className="text-black dark:text-white" key={link.name}>
                            <Link href={link.href}>{link.name}</Link>
                        </li>
                    )
                })}
            </nav> */}
        </>
    );
};