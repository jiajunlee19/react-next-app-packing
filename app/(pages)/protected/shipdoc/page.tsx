import { deleteShipdoc, readShipdocTotalPage, readShipdocByPage } from "@/app/_actions/shipdoc";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { type TReadShipdocSchema } from '@/app/_libs/zod_server';
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipdoc',
    description: 'Developed by jiajunlee',
};

export default async function Shipdoc({ searchParams }: { searchParams?: { itemsPerPage?: string, currentPage?: string, query?: string } }) {

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readShipdocTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage Shipdoc';

    const createButtonTitle = 'Create New Shipdoc';

    const readAction = readShipdocByPage;

    const columnListDisplay: (keyof TReadShipdocSchema)[] = ['shipdoc_uid', 'shipdoc_number', 'shipdoc_contact'];

    const primaryKey: (keyof TReadShipdocSchema) = 'shipdoc_uid';

    // "[placeholder-id]" will be replaced by "id" for each row in DataTable
    const hrefUpdate = "/shipdoc/[placeholder-id]/update";

    const deleteAction = deleteShipdoc;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href="/shipdoc/create">
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
