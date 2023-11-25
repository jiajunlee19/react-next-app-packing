import { deleteLot, readLotTotalPage, readLotByPage } from "@/app/_actions/lot";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
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
    params: {box_uid: string}, 
    searchParams?: {
        itemsPerPage?: string, 
        currentPage?: string, 
        query?: string,
    },
};

export default async function Lot({ params, searchParams }: LotProps) {

    const box_uid = params.box_uid;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readLotTotalPage(itemsPerPage, query, box_uid);

    const createButtonTitle = 'Create New Lot';

    const readAction = readLotByPage;

    const columnListDisplay: (keyof TReadLotSchema)[] = ['lot_uid', 'lot_part_number', 'lot_max_drive', 'lot_createdAt', 'lot_updatedAt'];

    const primaryKey: (keyof TReadLotSchema) = 'lot_uid';

    // "[placeholder-id]" will be replaced by "id" for each row in DataTable
    const hrefUpdate = `/box/${box_uid}/lot/[placeholder-id]/update`;

    const deleteAction = deleteLot;

    return (
        <>
            <div className="-mx-[2%]">
                <Breadcrumbs breadcrumbs={[
                    {label: 'Box', href: '/box', active: false},
                    {label: `${box_uid}`, href: `/box/${box_uid}/lot`, active: true}
                ]} />
            </div>

            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href={`/box/${box_uid}/lot/create`}>
                <button className="btn-primary w-min">
                    {createButtonTitle}
                </button>
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} id={box_uid} readAction={readAction} columnListDisplay={columnListDisplay} primaryKey={primaryKey} hrefUpdate={hrefUpdate} deleteAction={deleteAction} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
