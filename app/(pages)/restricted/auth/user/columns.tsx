"use client"

import { deleteUser } from "@/app/_actions/auth";
import TableActionButton from "@/app/_components/basic/button_table_action";
import UpdateButton from "@/app/_components/basic/button_update";
import { TRowData } from "@/app/_libs/types";
import { TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createColumnHelper } from "@tanstack/react-table";

// "[placeholder-id]" will be replaced by "id" for each row in DataTable
const hrefUpdate = "/restricted/auth/user/[user_uid]/updateRole";

const deleteAction = deleteUser;

const confirmMsg = "Are you sure to delete the user ?"

const columnHelper = createColumnHelper<TRowData | TReadUserWithoutPassSchema>();

export const columns = [
    columnHelper.accessor("user_uid", {
        id: "user_uid",
        header: "user_uid",
        footer: "user_uid",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("username", {
        id: "username",
        header: "username",
        footer: "username",
        meta: {
            type: "text",
        },
    }),
    columnHelper.accessor("role", {
        id: "role",
        header: "role",
        footer: "role",
        meta: {
            type: "text",
        },
    }),
    columnHelper.display({
        id: "action",
        header: "action",
        footer: "action",
        cell: ({ row }) => (
            <div className="flex gap-1 justify-center align-middle">
                {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[user_uid]", row.original.user_uid as string)} />}
                {!!deleteAction && <TableActionButton id={row.original.user_uid as string} action={deleteAction} redirectLink="/restricted/auth/user" icon={<TrashIcon className="h-5" />} confirmMsg={confirmMsg} />}
            </div>
        ),
    }),

];