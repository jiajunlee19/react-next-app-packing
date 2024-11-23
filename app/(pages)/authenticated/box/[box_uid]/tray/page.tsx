import { readTrayTotalPage, readTrayByPage } from "@/app/_actions/tray";
import { readBoxById } from "@/app/_actions/box";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/box/[box_uid]/tray/columns";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tray',
    description: 'Developed by jiajunlee',
};

type TrayProps =  { 
    params: {box_uid: string}, 
    searchParams?: {
        itemsPerPage?: string, 
        currentPage?: string, 
        query?: string,
    },
};

export default async function Tray({ params, searchParams }: TrayProps) {

    const box_uid = params.box_uid;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query?.trim().split(" ").join(" & ") || undefined;

    const totalPage = await readTrayTotalPage(itemsPerPage, query, box_uid);

    const createButtonTitle = 'Create New Tray';

    const readAction = readTrayByPage;

    const {box_current_tray, box_max_tray} = await readBoxById(box_uid);

    let isBoxMax = false;
    if (box_current_tray && box_max_tray && box_current_tray >= box_max_tray) {
        isBoxMax = true;
    }

    return (
        <>
            <div className="-mx-[2%]">
                <Breadcrumbs breadcrumbs={[
                    {label: 'Box', href: '/box', active: false},
                    {label: `Box: ${box_uid}`, href: `/box/${box_uid}/tray`, active: true}
                ]} />
            </div>

            <div className="flex gap-3 mb-[2%]">
                <p>box_max_tray = {box_max_tray}</p>
                <p>|</p>
                <p>box_current_tray = {box_current_tray}</p>
            </div>

            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={`/box/${box_uid}/tray/create`}>
                <button disabled={isBoxMax} className="btn-primary w-min">
                    {createButtonTitle}
                </button>
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} id={box_uid} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
