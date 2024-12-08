'use client'

import { useState } from "react";
import Link from "next/link";
import { CrossIcon, HamburgerIcon } from "@/app/_components/basic/icons";

export default function NavButton() {

    const [isShowNav, setIsShowNav] = useState(false);

    const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsShowNav(!isShowNav);
    };

    return (
        <>
            {!isShowNav ? 
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                <HamburgerIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
            </button>
            :
            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5" aria-label="Toggle navigation" onClick={handleNavClick}>
                <CrossIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
            </button>
            }
        </>
    );
}; 