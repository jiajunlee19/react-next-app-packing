import { deleteBox, readBoxTotalPage, readBoxByPage } from "@/app/_actions/box";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { type TReadBoxSchema } from '@/app/_libs/zod_server';
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Box',
    description: 'Developed by jiajunlee',
};

export default async function Box({ searchParams }: { searchParams?: { itemsPerPage?: string, currentPage?: string, query?: string } }) {

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readBoxTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage Box';

    const createButtonTitle = 'Create New Box';

    const readAction = readBoxByPage;

    const columnListDisplay: (keyof TReadBoxSchema)[] = ['box_uid', 'box_part_number', 'shipdoc_number', 'shipdoc_contact', 'box_status', 'box_createdAt', 'box_updatedAt'];

    const primaryKey: (keyof TReadBoxSchema) = 'box_uid';

    // "[placeholder-id]" will be replaced by "id" for each row in DataTable
    const hrefUpdate = "/box/[placeholder-id]/tray";

    const deleteAction = deleteBox;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href="/box/create">
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
