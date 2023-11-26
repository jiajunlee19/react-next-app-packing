"use client"

import { deleteBox } from "@/app/_actions/box";
import DeleteButton from "@/app/_components/basic/button_delete";
import UpdateButton from "@/app/_components/basic/button_update";
import { TReadBoxSchema } from "@/app/_libs/zod_server";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/box/[box_uid]/tray";

const deleteAction = deleteBox;

const columnHelper = createColumnHelper<TReadBoxSchema>();

export const columns = [
    columnHelper.accessor("box_uid", {
        id: "box_uid",
        header: "box_uid",
        footer: "box_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("box_status", {
        id: "box_status",
        header: "box_status",
        footer: "box_status",
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