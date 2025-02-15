import { GitHubIcon } from '@/app/_components/basic/icons'
import Link from 'next/link'

export default function Footer() {

    return (
        <>
            <div className="absolute inset-x-0 bottom-full h-1 transition bg-zinc-900 dark:bg-white" />
                <div className="flex flex-col items-center justify-between max-sm:my-2 sm:flex-row sm:mx-4 sm:h-full">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">© Copyright 2030. All rights reserved.</p>
                    <div className="flex gap-2 items-center">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">Developed by jiajunlee</p>
                    <button className="hover:bg-zinc-900/50 dark:hover:bg-white/50">
                        <Link href="/portfolio">
                            <span className="sr-only">View Jia Jun Lee&apos;s Portfolio</span>
                            <GitHubIcon className="h-5 w-5 fill-zinc-700 dark:fill-white" />
                        </Link>
                    </button>
                </div>
            </div>
        </>
    );

};