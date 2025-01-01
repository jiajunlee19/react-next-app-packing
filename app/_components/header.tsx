'use client'

import { HomeIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/app/_components/basic/search_bar";
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge";
import { CrossIcon, DarkIcon, HamburgerIcon, LightIcon, SearchIcon } from "@/app/_components/basic/icons";
import { useThemeContext } from "@/app/_context/theme-context";

export default function Header() {

    const { data: session } = useSession();

    const leftNavLinks = [
        { name: "Home", href: "/", icon: <HomeIcon className="h-5" /> },
    ];

    const midNavLinks = [
        { name: "History", href: "/authenticated/history", icon: "" },
        { name: "AdminList", href: "/authenticated/adminList", icon: "" },
    ];

    const rightNavLinksA = [
        { name: session?.user.username, href: "/auth/user/" + session?.user.user_uid, icon: "" },
        { name: "Sign Out", href: "/auth/signOut", icon: "" },
    ];

    const rightNavLinksB = [
        { name: "Sign In", href: "/auth/signIn", icon: "" },
        // { name: "Sign Up", href: "/auth/signUp", icon: "" },
    ];

    const actionNavLinks = [
        { name: "Manage Box", href: "/authenticated/box", icon: "" },
    ];

    const actionNavLinksProtected = [
        { name: "Manage Box Type", href: "/protected/box_type", icon: "" },
        { name: "Manage Tray Type", href: "/protected/tray_type", icon: "" },
        { name: "Manage Shipdoc", href: "/protected/shipdoc", icon: "" },
        { name: "Update User Role", href: "/protected/auth/updateRoleByUsername", icon: "" },
    ];

    const actionNavLinksRestricted = [
        { name: "User List", href: "/restricted/auth/user", icon: "" },
        { name: "Update Role by Username", href: "/restricted/auth/updateRoleByUsername", icon: "" },
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
    
    const {darkMode, setDarkMode} = useThemeContext();

    const handleThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDarkMode(!darkMode);
    };

    return (

        <>
            <div className="contents lg:block lg:w-64 lg:px-6 lg:pb-8 lg:pt-4 xl:w-72">
                {/* Left nav block thats only appear when > lg */}
                <div className="hidden lg:block">
                    <nav className="flex">
                        {leftNavLinks.map((link) => {
                            return (
                                <Link key={link.name} className={twMerge("no-underline", (pathname === link.href || pathname === "/") && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                    {link.icon ? link.icon : link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Border lines that only appears when > lg */}
                    {/* Top Left Horizontal Border line */}
                    {/* Left Vertical Border Line */}
                    <div className="absolute inset-x-0 top-14 h-1 transition bg-zinc-900 dark:bg-white lg:w-64 xl:w-72" />
                    <div className="absolute inset-y-0 w-1 h-full transition bg-zinc-900 dark:bg-white lg:left-64 xl:left-72" />
                </div>
                
                {/* Flexbox for entire header row, offset left by 64 for lg, offset left by 72 for xl */}
                <div className="flex fixed inset-x-0 top-0 h-14 items-center justify-between gap-12 px-4 transition lg:left-64 xl:left-72 bg-white dark:bg-zinc-900">
                    
                    {/* Top Horizontal Border Line */}
                    <div className="absolute inset-x-0 top-full h-1 transition bg-zinc-900 dark:bg-white" />

                    {/* Left nav bar that only appears when > lg */}
                    <div className="flex gap-5 items-center lg:hidden">
                        {!isShowNav ? 
                            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                                <HamburgerIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
                            </button>
                            :
                            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle navigation" onClick={handleNavClick}>
                                <CrossIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
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

                    {/* search bar between leftNav and middleNav */}
                    <div className="hidden lg:block lg:w-full lg:max-w-sm lg: ml-4">
                        <SearchBar />
                    </div>

                    {/* Flexbox for middleNav and rightNav */}
                    <div className="flex items-center gap-5">
    
                        {/* middleNav that only appears when > md */}
                        <nav className="hidden md:flex md:items-center md:gap-8">
                            {midNavLinks.map((link) => {
                                return (
                                    <Link key={link.name} className={twMerge("no-underline", pathname === link.href && "font-semibold text-purple-500 dark:text-purple-200")} href={link.href}>
                                        {link.icon ? link.icon : link.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider between middleNav and rightNav, only appears when > md */}
                        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900 md:dark:bg-white" />

                        {/* Flexbox for icons between middleNav and rightNav */}
                        <div className="flex gap-4">

                            {/* Search Icon that only appears when < lg */}
                            <div className="contents lg:hidden">
                                <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 ui-not-focus-visible:outline-none dark:hover:bg-white/50 lg:hidden" aria-label="Find something...">
                                    <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
                                </button>
                            </div>

                            {/* Theme Icon */}  
                            <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 dark:hover:bg-white/50" aria-label="Toggle theme" onClick={handleThemeClick}>
                                <LightIcon className="h-5 w-5 stroke-zinc-900 dark:hidden" />
                                <DarkIcon className="hidden h-5 w-5 stroke-white dark:block" />
                            </button>
                        </div>

                        {/* rightNav that only appears when > sm */}
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

                {/* Left nav block that only appears after hamburger is clicked */}
                <nav className={isShowNav ? 
                    "max-lg:fixed max-lg:z-20 max-lg:bg-white max-lg:top-16 max-lg:right-0 max-lg:bottom-0 max-lg:left-4 max-lg:w-56 max-lg:mb-14 max-lg:overflow-y-scroll lg:block lg:mt-10 dark:bg-zinc-900" 
                    : 
                    "hidden lg:block lg:mt-10"
                    }>
                    <ul role="list">
                        <li>
                            <h2>Actions</h2>
                            <div className="relative my-3 pl-2">
                                <div className="absolute inset-x-0 top-0 h-16 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5 origin-[50%_50%_1px]" />
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
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
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
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
                                <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/50 transform-none origin-[50%_50%_1px]" />
                                <ul role="list">
                                    {(session ? rightNavLinksA : rightNavLinksB).map((link) => {
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