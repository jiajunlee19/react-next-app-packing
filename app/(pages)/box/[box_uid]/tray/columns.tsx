"use client"

import { deleteTray } from "@/app/_actions/tray";
import DeleteButton from "@/app/_components/basic/button_delete";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadTraySchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/box/[box_uid]/tray/[tray_uid]/lot";

const deleteAction = deleteTray;

const columnHelper = createColumnHelper<TReadTraySchema>();

export const columns = [
    columnHelper.accessor("tray_uid", {
        id: "tray_uid",
        header: "tray_uid",
        footer: "tray_uid",
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
    columnHelper.accessor("tray_current_drive", {
        id: "tray_current_drive",
        header: "tray_current_drive",
        footer: "tray_current_drive",
        meta: {
            type: "number",
        },
    }),
    columnHelper.accessor("tray_createdAt", {
        id: "tray_createdAt",
        header: "tray_createdAt",
        footer: "tray_createdAt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("tray_updatedAt", {
        id: "tray_updatedAt",
        header: "tray_updatedAt",
        footer: "tray_updatedAt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[box_uid]", row.original.box_uid as string).replace("[tray_uid]", row.original.tray_uid as string)} />}
                {!!deleteAction && <DeleteButton deleteId={row.original.tray_uid as string} deleteAction={deleteAction} />}
            </div>
        ),
    }),
];