import { readBoxTypeTotalPage, readBoxTypeByPage } from "@/app/_actions/box_type";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/protected/box_type/columns";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Box Type',
    description: 'Developed by jiajunlee',
};

export default async function BoxType(
    props: { searchParams?: Promise<{ itemsPerPage?: string, currentPage?: string, query?: string }> }
) {
    const searchParams = await props.searchParams;

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readBoxTypeTotalPage(itemsPerPage, query);

    const pageTitle = 'Manage Box Type';

    const createButtonTitle = 'Create New Box Type';

    const readAction = readBoxTypeByPage;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Link className="btn btn-primary w-min no-underline p-[1%]" href="/protected/box_type/create">
                {createButtonTitle}
            </Link>
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
