import { deleteTrayType, readTrayTypeTotalPage, readTrayTypeByPage } from "@/app/_actions/tray_type";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { type TReadTrayTypeSchema } from '@/app/_libs/zod_server';
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tray Type',
    description: 'Developed by jiajunlee',
};

export default async function TrayType({ searchParams }: { searchParams?: { itemsPerPage?: string, currentPage?: string, query?: string } }) {

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readTrayTypeTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage Tray Type';

    const createButtonTitle = 'Create New Tray Type';

    const readAction = readTrayTypeByPage;

    const columnListDisplay: (keyof TReadTrayTypeSchema)[] = ['tray_type_uid', 'tray_part_number', 'tray_max_drive'];

    const primaryKey: (keyof TReadTrayTypeSchema) = 'tray_type_uid';

    // "[placeholder-id]" will be replaced by "id" for each row in DataTable
    const hrefUpdate = "/tray_type/[placeholder-id]/update";

    const deleteAction = deleteTrayType;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href="/tray_type/create">
                <button className="btn-primary w-min">
                    {createButtonTitle}
                </button>
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columnListDisplay={columnListDisplay} primaryKey={primaryKey} hrefUpdate={hrefUpdate} deleteAction={deleteAction} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
