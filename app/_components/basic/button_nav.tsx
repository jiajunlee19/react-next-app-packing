'use client'

import { useState } from "react";
import Link from "next/link";

export default function NavButton() {

    const [isShowNav, setIsShowNav] = useState(false);

    const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsShowNav(!isShowNav);
    };

    return (
        <>
            {!isShowNav ? 
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                <svg viewBox="0 0 10 9" fill="none" strokeLinecap="round" aria-hidden="true" className="w-2.5 stroke-zinc-900 dark:stroke-white">
                <path d="M.5 1h9M.5 8h9M.5 4.5h9"/>
                </svg>
            </button>
            :
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5" aria-label="Toggle navigation" onClick={handleNavClick}>
                <svg viewBox="0 0 10 9" fill="none" stroke-linecap="round" aria-hidden="true" className="w-2.5 stroke-zinc-900 dark:stroke-white">
                    <path d="m1.5 1 7 7M8.5 1l-7 7" />
                </svg>
            </button>
            }
        </>
    );
}; 