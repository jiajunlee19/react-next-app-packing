"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteShipdoc } from "@/app/_actions/shipdoc";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadShipdocSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/protected/shipdoc/[shipdoc_uid]/update";

const deleteAction = deleteShipdoc;

const confirmMsg = 'Are you sure to delete this item?';

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
    columnHelper.accessor("shipdoc_created_dt", {
        id: "shipdoc_created_dt",
        header: "shipdoc_created_dt",
        footer: "shipdoc_created_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("shipdoc_updated_dt", {
        id: "shipdoc_updated_dt",
        header: "shipdoc_updated_dt",
        footer: "shipdoc_updated_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.display({
        id: "action",
        header: "action",
        footer: "action",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[shipdoc_uid]", row.original.shipdoc_uid as string)} />}
                {!!deleteAction && <TableActionButton id={row.original.shipdoc_uid as string} action={deleteAction} redirectLink="/protected/shipdoc" icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
];