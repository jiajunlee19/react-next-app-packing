import { readShippedBoxTotalPage, readShippedBoxByPage } from "@/app/_actions/box";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { columns } from "@/app/(pages)/protected/history/columns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipped Box',
    description: 'Developed by jiajunlee',
};

export default async function ShippedBox(
    props: { searchParams?: Promise<{ itemsPerPage?: string, currentPage?: string, query?: string }> }
) {
    const searchParams = await props.searchParams;

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/history");
    }

    const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
    const currentPage = Number(searchParams?.currentPage) || 1;
    const query = searchParams?.query?.trim().split(" ").join(" & ") || undefined;

    const totalPage = await readShippedBoxTotalPage(itemsPerPage, query);

    const pageTitle = 'View Shipped Box';

    // const createButtonTitle = 'Create New Box';

    const readAction = readShippedBoxByPage;

    return (
        <>
            <h1>{pageTitle}</h1>
            {/* <Link className="no-underline text-white dark:text-emerald-400 hover:text-white hover:dark:text-emerald-400" href="/box/create">
                <button className="btn-primary w-min">
                    {createButtonTitle}
                </button>
            </Link> */}
            <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
                <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columns={columns} />
            </Suspense>
            <Pagination totalPage={totalPage} />
        </>
    )
};
