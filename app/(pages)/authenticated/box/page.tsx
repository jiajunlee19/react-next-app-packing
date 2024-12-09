import { deleteBox, readBoxTotalPage, readBoxByPage } from "@/app/_actions/box";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/authenticated/box/columns";
import { type TReadBoxSchema } from '@/app/_libs/zod_server';
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Box',
    description: 'Developed by jiajunlee',
};

export default async function Box(
    props: { searchParams?: Promise<{ itemsPerPage?: string, currentPage?: string, query?: string }> }
) {
    const searchParams = await props.searchParams;
    
    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readBoxTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage Box';

    const createButtonTitle = 'Create New Box';

    const readAction = readBoxByPage;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="btn btn-primary w-min no-underline p-[1%]" href="/authenticated/box/create">
                {createButtonTitle}
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
