"use client"

import { TRowData } from "@/app/_libs/types";
import { TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import { createColumnHelper } from "@tanstack/react-table";

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
    columnHelper.accessor("email", {
        id: "email",
        header: "email",
        footer: "email",
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

];