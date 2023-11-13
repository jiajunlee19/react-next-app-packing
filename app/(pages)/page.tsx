import Image from "next/image";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Home',
    description: 'Developed by jiajunlee',
};

export default function Home() {
    return (
        <>
            <h1>Home</h1>
            <p>This is your home page!</p>
            {/* <Image
                src="/desktop.png"
                width={1000}
                height={760}
                className="hidden md:block"
                alt="This is a desktop image"
            /> */}
        </>
    )
};