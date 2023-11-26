"use client"

import { deleteShipdoc } from "@/app/_actions/shipdoc";
import DeleteButton from "@/app/_components/basic/button_delete";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadShipdocSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/protected/shipdoc/[shipdoc_uid]/update";

const deleteAction = deleteShipdoc;

const columnHelper = createColumnHelper<TReadShipdocSchema>();

export const columns = [
    columnHelper.accessor("shipdoc_uid", {
        id: "shipdoc_uid",
        header: "shipdoc_uid",
        footer: "shipdoc_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("shipdoc_number", {
        id: "shipdoc_number",
        header: "shipdoc_number",
        footer: "shipdoc_number",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("shipdoc_contact", {
        id: "shipdoc_contact",
        header: "shipdoc_contact",
        footer: "shipdoc_contact",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("shipdoc_createdAt", {
        id: "shipdoc_createdAt",
        header: "shipdoc_createdAt",
        footer: "shipdoc_createdAt",
        meta: {
            type: "date",
        },
    }),
    columnHelper.accessor("shipdoc_updatedAt", {
        id: "shipdoc_updatedAt",
        header: "shipdoc_updatedAt",
        footer: "shipdoc_updatedAt",
        meta: {
            type: "date",
        },
    }),
    columnHelper.display({
        id: "action",
        header: "action",
        footer: "action",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[shipdoc_uid]", row.original.shipdoc_uid as string)} />}
                {!!deleteAction && <DeleteButton deleteId={row.original.shipdoc_uid as string} deleteAction={deleteAction} />}
            </div>
        ),
    }),
];