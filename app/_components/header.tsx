'use client'

import { HomeIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "@/app/_components/basic/search_bar";
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge";

export default function Header() {

    const { data: session } = useSession();

    const leftNavLinks = [
        { name: "Home", href: "/", icon: <HomeIcon className="h-5" /> },
    ];

    const midNavLinks = [
        { name: "History", href: "/history", icon: "" },
        { name: "AdminList", href: "/adminList", icon: "" },
    ];

    const rightNavLinksA = [
        { name: session?.user.email, href: "/auth/user/" + session?.user.user_uid, icon: "" },
        { name: "Sign Out", href: "/auth/signOut", icon: "" },
    ];

    const rightNavLinksB = [
        { name: "Sign In", href: "/auth/signIn", icon: "" },
        { name: "Sign Up", href: "/auth/signUp", icon: "" },
    ];

    const actionNavLinks = [
        { name: "Manage Box", href: "/box", icon: "" },
    ];

    const actionNavLinksProtected = [
        { name: "Manage Box Type", href: "/protected/box_type", icon: "" },
        { name: "Manage Tray Type", href: "/protected/tray_type", icon: "" },
        { name: "Manage Shipdoc", href: "/protected/shipdoc", icon: "" },
        { name: "Update User Role", href: "/protected/auth/updateRoleByEmail", icon: "" },
    ];

    const actionNavLinksRestricted = [
        { name: "User List", href: "/restricted/auth/user", icon: "" },
        { name: "Update Role by Email", href: "/restricted/auth/updateRoleByEmail", icon: "" },
    ];

    const pathname = usePathname();

    const [isShowNav, setIsShowNav] = useState(false);

    const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsShowNav(!isShowNav);
    };
    

    const handleResize = () => {
        setIsShowNav(false);
    };
    typeof window !== "undefined" && window.addEventListener("resize", handleResize);
    

    const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);

    const handleThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode === undefined) {
            setDarkMode(localStorage.getItem('darkMode') === 'true');
        }
        else if (darkMode) {
            localStorage.setItem('darkMode', 'true');
            window.document.documentElement.classList.add('dark');
        }
        else {
            localStorage.setItem('darkMode', 'false');
            window.document.documentElement.classList.remove('dark');
        }

    }, [darkMode]);

    return (

        <>
            <div className="contents lg:block lg:w-72 lg:pointer-events-auto lg:overflow-y-auto lg:border-r-4 lg:border-zinc-900 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white xl:w-80">
                <div className="hidden lg:flex">
                    <nav>
                        {leftNavLinks.map((link) => {
                            return (
                                <Link key={link.name} className={twMerge("no-underline", (pathname === link.href || pathname === "/") && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                    {link.icon ? link.icon : link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                
                <div className="flex fixed inset-x-0 top-0 h-14 items-center justify-between gap-12 px-4 transition lg:left-72 xl:left-80 bg-white dark:bg-zinc-900">
                    <div className="absolute inset-x-0 top-full h-1 transition bg-zinc-900 dark:bg-white" />
                    
                    <div className="flex gap-5 items-center lg:hidden">
                        {!isShowNav ? 
                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                            <svg viewBox="0 0 10 9" fill="none" strokeLinecap="round" aria-hidden="true" className="w-2.5 stroke-zinc-900 dark:stroke-white">
                                <path d="M.5 1h9M.5 8h9M.5 4.5h9"/>
                            </svg>
                        </button>
                        :
                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                            <svg viewBox="0 0 10 9" fill="none" strokeLinecap="round" aria-hidden="true" className="w-2.5 stroke-zinc-900 dark:stroke-white">
                                <path d="m1.5 1 7 7M8.5 1l-7 7" />
                            </svg>
                        </button>
                        }
                        <nav>
                            {leftNavLinks.map((link) => {
                                return (
                                    <Link key={link.name} className={twMerge("no-underline", (pathname === link.href || pathname === "/") && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>{link.name}</Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="hidden lg:block lg:w-full lg:max-w-sm lg: ml-4">
                        <SearchBar />
                    </div>

                    <div className="flex items-center gap-5">
                    <nav className="hidden md:flex md:items-center md:gap-8">
                        {midNavLinks.map((link) => {
                            return (
                                <Link key={link.name} className={twMerge("no-underline", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                    {link.icon ? link.icon : link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900 md:dark:bg-white" />

                    <div className="flex gap-4">
                        <div className="contents lg:hidden">
                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 ui-not-focus-visible:outline-none dark:hover:bg-white/50 lg:hidden" aria-label="Find something...">
                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5 stroke-zinc-900 dark:stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"/>
                            </svg>
                        </button>
                        </div>

                        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle theme" onClick={handleThemeClick}>
                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5 stroke-zinc-900 dark:hidden">
                                <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                <path strokeLinecap="round" d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707"/>
                            </svg>
                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="hidden h-5 w-5 stroke-white dark:block">
                                <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="hidden sm:contents">
                        <>
                            {(session ? rightNavLinksA : rightNavLinksB).map((link) => {
                                return (
                                    <Link key={link.name} className={twMerge("no-underline", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                        {link.icon ? link.icon : link.name}
                                    </Link>
                                );
                            })}
                        </>
                    </div>

                    </div>
                </div>

                {/* Left nav bar */}
                <nav className={isShowNav ? 
                    "max-lg:fixed max-lg:z-40 max-lg:bg-white max-lg:top-16 max-lg:right-0 max-lg:bottom-0 max-lg:left-4 max-lg:w-full max-lg:mb-14 max-lg:overflow-y-scroll lg:block lg:mt-10 dark:bg-zinc-900" 
                    : 
                    "hidden lg:block lg:mt-10"
                    }>
                    <ul role="list">
                        <li>
                            <h2>Actions</h2>
                            <div className="relative my-3 pl-2">
                                <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
                                {/* <div className="absolute top-1 left-2 h-6 w-px bg-emerald-500 transform-none origin-[50%_50%_1px]" /> */}
                                <ul role="list">
                                    {actionNavLinks.map((link) => {
                                        return (
                                            <li key={link.name} className="relative">
                                                <Link key={link.name} className={twMerge("no-underline py-1 pl-4 pr-3 truncate", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                                    {link.icon ? link.icon : link.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {(session?.user.role === 'admin' || session?.user.role === 'boss') &&
                            <>
                                <h2>Protected Actions</h2>
                                <div className="relative my-3 pl-2">
                                    <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                    <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
                                    {/* <div className="absolute top-1 left-2 h-6 w-px bg-emerald-500 transform-none origin-[50%_50%_1px]" /> */}
                                    <ul role="list">
                                        {actionNavLinksProtected.map((link) => {
                                            return (
                                                <li key={link.name} className="relative">
                                                    <Link key={link.name} className={twMerge("no-underline py-1 pl-4 pr-3 truncate", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                                        {link.icon ? link.icon : link.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </>
                            }

                            {session?.user.role === 'boss' &&
                            <>
                                <h2>Restricted Actions</h2>
                                <div className="relative my-3 pl-2">
                                    <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                    <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
                                    {/* <div className="absolute top-1 left-2 h-6 w-px bg-emerald-500 transform-none origin-[50%_50%_1px]" /> */}
                                    <ul role="list">
                                        {actionNavLinksRestricted.map((link) => {
                                            return (
                                                <li key={link.name} className="relative">
                                                    <Link key={link.name} className={twMerge("no-underline py-1 pl-4 pr-3 truncate", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                                        {link.icon ? link.icon : link.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </>
                            }
                        </li>

                        <li className="pt-3 md:hidden">
                            <h2>Links</h2>
                            <div className="relative my-3 pl-2">
                                <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5 transform-none origin-[50%_50%_1px]" />
                                {/* <div className="absolute top-1 left-2 h-6 w-px bg-emerald-500 transform-none origin-[50%_50%_1px]" /> */}
                                <ul role="list">
                                    {midNavLinks.map((link) => {
                                        return (
                                            <li key={link.name} className="relative">
                                                <Link key={link.name} className={twMerge("no-underline py-1 pl-4 pr-3 truncate", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                                    {link.icon ? link.icon : link.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </li>
                            
                        <li className="pt-3 sm:hidden">
                            <h2>Auth</h2>
                            <div className="relative pl-2 my-3 bottom-0">
                                <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5 transform-none origin-[50%_50%_1px]" />
                                {/* <div className="absolute top-1 left-2 h-6 w-px bg-emerald-500 transform-none origin-[50%_50%_1px]" /> */}
                                <ul role="list">
                                    { (session ? rightNavLinksA : rightNavLinksB).map((link) => {
                                        return (
                                            <li key={link.name} className="relative">
                                                <Link key={link.name} className={twMerge("no-underline py-1 pl-4 pr-3 truncate", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                                    {link.icon ? link.icon : link.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}; 