"use client"

import { deleteTrayType } from "@/app/_actions/tray_type";
import DeleteButton from "@/app/_components/basic/button_delete";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadTrayTypeSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/protected/tray_type/[tray_type_uid]/update";

const deleteAction = deleteTrayType;

const columnHelper = createColumnHelper<TReadTrayTypeSchema>();

export const columns = [
    columnHelper.accessor("tray_type_uid", {
        id: "tray_type_uid",
        header: "tray_type_uid",
        footer: "tray_type_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("tray_part_number", {
        id: "tray_part_number",
        header: "tray_part_number",
        footer: "tray_part_number",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("tray_max_drive", {
        id: "tray_max_drive",
        header: "tray_max_drive",
        footer: "tray_max_drive",
        meta: {
            type: "number",
        },
    }),
    columnHelper.accessor("tray_type_createdAt", {
        id: "tray_type_createdAt",
        header: "tray_type_createdAt",
        footer: "tray_type_createdAt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("tray_type_updatedAt", {
        id: "tray_type_updatedAt",
        header: "tray_type_updatedAt",
        footer: "tray_type_updatedAt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[tray_type_uid]", row.original.tray_type_uid as string)} />}
                {!!deleteAction && <DeleteButton deleteId={row.original.tray_type_uid as string} deleteAction={deleteAction} />}
            </div>
        ),
    }),
];