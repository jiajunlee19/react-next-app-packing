import { readLotTotalPage, readLotByPage } from "@/app/_actions/lot";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/box/[box_uid]/tray/[tray_uid]/lot/columns";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';
import { readTrayById } from "@/app/_actions/tray";

export const metadata: Metadata = {
    title: 'Lot',
    description: 'Developed by jiajunlee',
};

type LotProps =  { 
    params: {
        box_uid: string,
        tray_uid: string,
    }, 
    searchParams?: {
        itemsPerPage?: string, 
        currentPage?: string, 
        query?: string,
    },
};

export default async function Lot({ params, searchParams }: LotProps) {

    const box_uid = params.box_uid;
    const tray_uid = params.tray_uid;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readLotTotalPage(itemsPerPage, query, tray_uid);

    const createButtonTitle = 'Create New Lot';

    const readAction = readLotByPage;

    const {tray_current_drive, tray_max_drive} = await readTrayById(tray_uid);

    let isTrayMax = false;
    if (tray_current_drive && tray_max_drive && tray_current_drive >= tray_max_drive) {
        isTrayMax = true;
    }

    return (
        <>
            <div className="-mx-[2%]">
                <Breadcrumbs breadcrumbs={[
                    {label: 'Box', href: '/box', active: false},
                    {label: `Box: ${box_uid}`, href: `/box/${box_uid}/tray`, active: false},
                    {label: `Tray: ${tray_uid}`, href: `/box/${box_uid}/tray/${tray_uid}/lot`, active: true},
                ]} />
            </div>
            
            <div className="flex gap-3 mb-[2%]">
                <p>tray_max_drive = {tray_max_drive}</p>
                <p>|</p>
                <p>tray_current_drive = {tray_current_drive}</p>
            </div>

            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={`/box/${box_uid}/tray/${tray_uid}/lot/create`}>
                <button disabled={isTrayMax} className="btn-primary w-min">
                    {createButtonTitle}
                </button>
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} id={tray_uid} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
