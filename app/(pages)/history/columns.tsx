"use client"

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { shipBox } from "@/app/_actions/box";
import TableActionButton from "@/app/_components/basic/button_table_action";
import { type TRowData } from "@/app/_libs/types";
import { type TShippedBoxHistorySchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

const undoAction = shipBox;

const columnHelper = createColumnHelper<TRowData | TShippedBoxHistorySchema>();

const confirmMsg = 'Are you sure to ship this item?';

export const columns = [
    columnHelper.display({
        id: "undo",
        header: "undo",
        footer: "undo",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!undoAction && <TableActionButton id={row.original.box_uid as string} action={undoAction} icon={<ArrowLeftOnRectangleIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
    columnHelper.accessor("box_uid", {
        id: "box_uid",
        header: "box_uid",
        footer: "box_uid",
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
    columnHelper.accessor("box_updated_dt", {
        id: "box_updated_dt",
        header: "box_updated_dt",
        footer: "box_updated_dt",
        meta: {
            type: "date",
        },
        cell: ({ cell }) => cell.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("tray_uid", {
        id: "tray_uid",
        header: "tray_uid",
        footer: "tray_uid",
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
];