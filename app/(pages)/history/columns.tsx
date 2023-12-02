"use client"

import { shipBox } from "@/app/_actions/box";
import ShipButton from "@/app/_components/basic/button_ship";
import { type TRowData } from "@/app/_libs/types";
import { type TShippedBoxHistorySchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

const shipAction = shipBox;

const columnHelper = createColumnHelper<TRowData | TShippedBoxHistorySchema>();

export const columns = [
    columnHelper.display({
        id: "undo",
        header: "undo",
        footer: "undo",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!shipAction && <ShipButton shipId={row.original.box_uid as string} shipAction={shipAction} />}
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
];