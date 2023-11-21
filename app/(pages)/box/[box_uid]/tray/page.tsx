import { deleteTray, readTrayTotalPage, readTrayByPage } from "@/app/_actions/tray";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { type TReadTraySchema } from '@/app/_libs/zod_server';
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
    const query = searchParams?.query || undefined;

    const totalPage = await readTrayTotalPage(itemsPerPage, query, box_uid);

    const pageTitle = 'Manage Tray';

    const createButtonTitle = 'Create New Tray';

    const readAction = readTrayByPage;

    const columnListDisplay: (keyof TReadTraySchema)[] = ['tray_uid', 'tray_part_number', 'tray_max_drive', 'tray_createdAt', 'tray_updatedAt'];

    const primaryKey: (keyof TReadTraySchema) = 'tray_uid';

    // "[placeholder-id]" will be replaced by "id" for each row in DataTable
    const hrefUpdate = "/tray/[placeholder-id]/update";

    const deleteAction = deleteTray;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href="/tray/create">
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
