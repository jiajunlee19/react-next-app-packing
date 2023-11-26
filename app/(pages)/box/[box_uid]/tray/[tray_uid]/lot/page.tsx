import { deleteLot, readLotTotalPage, readLotByPage } from "@/app/_actions/lot";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/box/[box_uid]/tray/[tray_uid]/lot/columns";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import { type TReadLotSchema } from '@/app/_libs/zod_server';
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

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

    return (
        <>
            <div className="-mx-[2%]">
                <Breadcrumbs breadcrumbs={[
                    {label: 'Box', href: '/box', active: false},
                    {label: `Box: ${box_uid}`, href: `/box/${box_uid}/tray`, active: false},
                    {label: `Tray: ${tray_uid}`, href: `/box/${box_uid}/tray/${tray_uid}/lot`, active: true},
                ]} />
            </div>

            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={`/box/${box_uid}/tray/${tray_uid}/lot/create`}>
                <button className="btn-primary w-min">
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
