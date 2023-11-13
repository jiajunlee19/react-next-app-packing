"use client"

import { generatePagination } from "@/app/_libs/pagination";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useDebouncedCallback } from "use-debounce";

type PaginationProps = {
    totalPage: number,
};

export default function Pagination({ totalPage }: PaginationProps) {
    
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;
    const currentPage = Number(searchParams.get("currentPage")) || 1;
    const query = searchParams.get("query") || undefined;

    const pages = generatePagination(currentPage, totalPage);

    const createPageUrl = (itemsPerPage: number | string, currentPage: number | string, query?: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("itemsPerPage", itemsPerPage.toString())
        params.set("currentPage", currentPage.toString());
        if (query) {
            params.set("query", query.toString());
        }
        else {
            params.delete("query");
        }
        return `${pathname}?${params.toString()}`;
    };

    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set("query", e.target.value);
        }
        else {
            params.delete("query");
        }
        if (itemsPerPage && currentPage) {
            params.set("itemsPerPage", itemsPerPage.toString());
            params.set("currentPage", currentPage.toString())
        }
        else {
            params.delete("itemsPerPage");
            params.delete("currentPage");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set("itemsPerPage", e.target.value);
            params.set("currentPage", "1")
        }
        else {
            params.delete("itemsPerPage");
            params.delete("currentPage");
        }
        if (query) {
            params.set("query", query.toString());
        }
        else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    };
     
    return (
        <div className="inline-flex">
            <div className="flex">
                <label className="h-10 w-min text-sm p-2 mr-1 md:mr-2" htmlFor="query">Find: </label>
                <input className="h-10 w-min rounded-md text-sm p-2 mr-2 md:mr-4" name="query" type="text" defaultValue={query} onBlur={handleQueryChange} onChange={useDebouncedCallback(handleQueryChange, 3000)} required />
            </div>
            <div className="flex">
                <label className="h-10 w-min text-sm p-2 mr-1 md:mr-2" htmlFor="itemsPerPage">itemsPerPage: </label>
                <input className="h-10 w-14 rounded-md text-sm p-2 mr-2 md:mr-4" name="itemsPerPage" type="number" step="1" min="1" max="20" defaultValue={itemsPerPage} onBlur={handleInputChange} onChange={useDebouncedCallback(handleInputChange, 3000)} required />
            </div>
            <PaginationArrow direction="left" href={createPageUrl(itemsPerPage, currentPage-1, query)} isDisabled={currentPage<=1} />
            <div className="flex -space-x-px">
                {
                    pages.map((page, index) => {
                        let position: 'first' | 'last' | 'single' | 'middle' | undefined;
                        if (index === 0) position = 'first';
                        if (index === pages.length - 1) position = 'last';
                        if (pages.length === 1) position = 'single';
                        if (page === '...') position = 'middle';

                        return (
                            <PaginationNumber key={page} href={createPageUrl(itemsPerPage, page, query)} page={page} position={position} isActive={currentPage===page} />
                        );
                    })
                }
            </div>
            <PaginationArrow direction="right" href={createPageUrl(itemsPerPage, currentPage+1, query)} isDisabled={currentPage>=totalPage} />
        </div>
    )
};

type PaginationArrowProps = {
    href: string,
    direction: 'left' | 'right',
    isDisabled?: boolean,
};

function PaginationArrow({ href, direction, isDisabled }: PaginationArrowProps) {

    const className = twMerge(
        'flex h-10 w-10 items-center justify-center btn-primary', 
        isDisabled && 'pointer-events-none hidden',
        direction === 'left' && 'mr-2 md:mr-4',
        direction === 'right' && 'ml-2 md:ml-4',
    );

    const icon = direction === 'left' ? <ArrowLeftIcon className="w-4" /> : <ArrowRightIcon className="w-4" />;

    return (
        isDisabled ?
        <button className={className}>
            {icon}
        </button>
        :
        <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={href}>
            <button className={className}>
                {icon}
            </button>
        </Link>
    );
};

type PaginationNumberProps = {
    page: number | string,
    href: string,
    position?: 'first' | 'last' | 'middle' | 'single',
    isActive: boolean,
};

function PaginationNumber({ page, href, isActive, position }: PaginationNumberProps) {
    const className = twMerge(
        'flex h-10 w-10 items-center justify-center btn-primary text-sm rounded-none',
        position === 'single' && 'pointer-events-none hidden',
        position === 'first' && 'rounded-l-md',
        position === 'last' && 'rounded-r-md',
        isActive && 'pointer-events-none opacity-70',
        // (!isActive && position != 'middle') && 'hover:bg-gray-100',
        position === 'middle' && 'pointer-events-none opacity-70',
    );

    return (
        (isActive || position === 'middle') ?
        <button className={className}>
            {page}
        </button>
        :
        <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={href}>
            <button className={className}>
                {page}
            </button>
        </Link>
    );
};