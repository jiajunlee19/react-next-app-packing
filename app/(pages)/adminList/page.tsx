import { readAdminByPage, readAdminTotalPage } from "@/app/_actions/auth";
import { type TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/adminList/columns";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin List',
    description: 'Developed by jiajunlee',
};

export default async function AdminListPage({ searchParams }: { searchParams?: { itemsPerPage?: string, currentPage?: string, query?: string } }) {

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query || undefined;

    const totalPage = await readAdminTotalPage(itemsPerPage, query);

    const pageTitle = 'Admin List';

    const readAction = readAdminByPage;

    return (
        <>
            <h1>{pageTitle}</h1>
            <Suspense fallback={<TableSkeleton columnCount={2} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
      )
};