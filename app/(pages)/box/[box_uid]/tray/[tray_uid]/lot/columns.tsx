"use client"

import { deleteLot } from "@/app/_actions/lot";
import DeleteButton from "@/app/_components/basic/button_delete";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadLotSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/box/[box_uid]/tray/[tray_uid]/lot/[lot_uid]/update";

const deleteAction = deleteLot;

const columnHelper = createColumnHelper<TReadLotSchema>();

export const columns = [
    columnHelper.accessor("lot_uid", {
        id: "lot_uid",
        header: "lot_uid",
        footer: "lot_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("lot_id", {
        id: "lot_id",
        header: "lot_id",
        footer: "lot_id",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("lot_qty", {
        id: "lot_qty",
        header: "lot_qty",
        footer: "lot_qty",
        meta: {
            type: "number",
        },
    }),
    columnHelper.accessor("lot_createdAt", {
        id: "lot_createdAt",
        header: "lot_createdAt",
        footer: "lot_createdAt",
        meta: {
            type: "date",
        },
    }),
    columnHelper.accessor("lot_updatedAt", {
        id: "lot_updatedAt",
        header: "lot_updatedAt",
        footer: "lot_updatedAt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[box_uid]", row.original.box_uid as string).replace("[tray_uid]", row.original.tray_uid as string).replace("[lot_uid]", row.original.lot_uid as string)} />}
                {!!deleteAction && <DeleteButton deleteId={row.original.lot_uid as string} deleteAction={deleteAction} />}
            </div>
        ),
    }),
];