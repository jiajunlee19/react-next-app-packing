"use client"

import { TrashIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { deleteBox, shipBox } from "@/app/_actions/box";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadBoxSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/box/[box_uid]/tray";

const deleteAction = deleteBox;

const shipAction = shipBox;

const confirmMsg = 'Are you sure to delete this item?';
const confirmMsgShip = 'Are you sure to ship this item?';

const columnHelper = createColumnHelper<TReadBoxSchema>();

export const columns = [
    columnHelper.display({
        id: "ship",
        header: "ship",
        footer: "ship",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!shipAction && <TableActionButton id={row.original.box_uid as string} action={shipAction} icon={<PaperAirplaneIcon className="h-5" />} confirmMsg={confirmMsgShip} />}
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
    columnHelper.accessor("box_updated_dt", {
        id: "box_updated_dt",
        header: "box_updated_dt",
        footer: "box_updated_dt",
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
                {!!deleteAction && <TableActionButton id={row.original.box_uid as string} action={deleteAction} icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),
];