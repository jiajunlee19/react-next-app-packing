"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteLot } from "@/app/_actions/lot";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadLotSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/authenticated/box/[box_uid]/tray/[tray_uid]/lot/[lot_uid]/update";

const deleteAction = deleteLot;

const confirmMsg = 'Are you sure to delete this item?';

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
    columnHelper.accessor("lot_created_dt", {
        id: "lot_created_dt",
        header: "lot_created_dt",
        footer: "lot_created_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("lot_updated_dt", {
        id: "lot_updated_dt",
        header: "lot_updated_dt",
        footer: "lot_updated_dt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[box_uid]", row.original.box_uid as string).replace("[tray_uid]", row.original.tray_uid as string).replace("[lot_uid]", row.original.lot_uid as string)} />}
                {!!deleteAction && <TableActionButton id={row.original.lot_uid as string} action={deleteAction} redirectLink={"/authenticated/box/[box_uid]/tray/[tray_uid]/lot".replace("[box_uid]", row.original.box_uid as string).replace("[tray_uid]", row.original.tray_uid as string)} icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
];