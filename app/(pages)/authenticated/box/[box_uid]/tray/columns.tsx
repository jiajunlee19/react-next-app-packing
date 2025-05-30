"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteTray } from "@/app/_actions/tray";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadTraySchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/authenticated/box/[box_uid]/tray/[tray_uid]/lot";

const deleteAction = deleteTray;

const confirmMsg = 'Are you sure to delete this item?';

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
    columnHelper.accessor("tray_created_dt", {
        id: "tray_created_dt",
        header: "tray_created_dt",
        footer: "tray_created_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("tray_updated_dt", {
        id: "tray_updated_dt",
        header: "tray_updated_dt",
        footer: "tray_updated_dt",
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
                {!!deleteAction && <TableActionButton id={row.original.tray_uid as string} action={deleteAction} redirectLink={"/authenticated/box/[box_uid]/tray".replace("[box_uid]", row.original.box_uid as string)} icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
];