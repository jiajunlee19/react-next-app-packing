"use client"

import { deleteBox, shipBox } from "@/app/_actions/box";
import DeleteButton from "@/app/_components/basic/button_delete";
import ShipButton from "@/app/_components/basic/button_ship";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadBoxSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/box/[box_uid]/tray";

const deleteAction = deleteBox;

const shipAction = shipBox;

const columnHelper = createColumnHelper<TReadBoxSchema>();

export const columns = [
    columnHelper.display({
        id: "ship",
        header: "ship",
        footer: "ship",
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
    columnHelper.accessor("box_current_tray", {
        id: "box_current_tray",
        header: "box_current_tray",
        footer: "box_current_tray",
        meta: {
            type: "number",
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
    columnHelper.accessor("box_updatedAt", {
        id: "box_updatedAt",
        header: "box_updatedAt",
        footer: "box_updatedAt",
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
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[box_uid]", row.original.box_uid as string)} />}
                {!!deleteAction && <DeleteButton deleteId={row.original.box_uid as string} deleteAction={deleteAction} />}
            </div>
        ),
    }),
];