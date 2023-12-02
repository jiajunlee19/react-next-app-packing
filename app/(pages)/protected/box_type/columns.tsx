"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteBoxType } from "@/app/_actions/box_type";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadBoxTypeSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/protected/box_type/[box_type_uid]/update";

const deleteAction = deleteBoxType;

const confirmMsg = 'Are you sure to delete this item?';

const columnHelper = createColumnHelper<TReadBoxTypeSchema>();

export const columns = [
    columnHelper.accessor("box_type_uid", {
        id: "box_type_uid",
        header: "box_type_uid",
        footer: "box_type_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("box_part_number", {
        id: "box_part_number",
        header: "box_part_number",
        footer: "box_part_number",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("box_max_tray", {
        id: "box_max_tray",
        header: "box_max_tray",
        footer: "box_max_tray",
        meta: {
            type: "number",
        },
    }),
    columnHelper.accessor("box_type_created_dt", {
        id: "box_type_created_dt",
        header: "box_type_created_dt",
        footer: "box_type_created_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("box_type_updated_dt", {
        id: "box_type_updated_dt",
        header: "box_type_updated_dt",
        footer: "box_type_updated_dt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[box_type_uid]", row.original.box_type_uid as string)} />}
                {!!deleteAction && <TableActionButton id={row.original.box_type_uid as string} action={deleteAction} icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
];