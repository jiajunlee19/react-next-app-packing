import { readUserTotalPage, readUserByPage, deleteUser } from "@/app/_actions/auth";
import Pagination from "@/app/_components/basic/pagination";
import TableSkeleton from "@/app/_components/basic/skeletons";
import DataTable from "@/app/_components/data_table";
import { type TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import { Suspense } from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User',
    description: 'Developed by jiajunlee',
};

export default async function User({ searchParams }: { searchParams?: { itemsPerPage?: string, currentPage?: string, query?: string } }) {

  const itemsPerPage = Number(searchParams?.itemsPerPage) || 10;
  const currentPage = Number(searchParams?.currentPage) || 1;
  const query = searchParams?.query || undefined;

  const totalPage = await readUserTotalPage(itemsPerPage, query);
  
  const pageTitle = 'Manage User';

  const readAction = readUserByPage;

  const columnListDisplay: (keyof TReadUserWithoutPassSchema)[] = ['user_uid', 'email', 'role'];
  
  const primaryKey: (keyof TReadUserWithoutPassSchema) = 'user_uid';

  // "[placeholder-id]" will be replaced by "id" for each row in DataTable
  const hrefUpdate = "/restricted/auth/user/[placeholder-id]/updateRole";

  const deleteAction = deleteUser;

  return (
    <>
        <h1>{pageTitle}</h1>
        <Suspense fallback={<TableSkeleton columnCount={4} rowCount={10} />}>
            <DataTable itemsPerPage={itemsPerPage} currentPage={currentPage} query={query} readAction={readAction} columnListDisplay={columnListDisplay} primaryKey={primaryKey} hrefUpdate={hrefUpdate} deleteAction={deleteAction} />
        </Suspense>
        <Pagination totalPage={totalPage} />
    </>
  )
}
