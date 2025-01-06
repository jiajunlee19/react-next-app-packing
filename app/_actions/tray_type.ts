'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readTrayTypeSchema, createTrayTypeSchema, updateTrayTypeSchema, deleteTrayTypeSchema, TReadTrayTypeSchema, trayPartNumberSchema } from "@/app/_libs/zod_server";
import { uuidSchema, itemsPerPageSchema, currentPageSchema, querySchema } from '@/app/_libs/zod_server';
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readTrayTypeTotalPage(itemsPerPage: number | unknown, query?: string | unknown) {
    noStore();

    const parsedItemsPerPage = itemsPerPageSchema.parse(itemsPerPage);
    const parsedQuery = querySchema.parse(query);

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        redirect("/tooManyRequests");
    }

    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['tray_type_uid', 'tray_part_number'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${parsedQuery.replace(/[\s\n\t]/g, '_')}:*`,
                                        },
                                    };
                                })),
                            ],
                        }),
                },
            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readTrayTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM [packing].[tray_type]
                                    WHERE (tray_type_uid like @query OR tray_part_number like @query);
                            `;
            parsedForm = readTrayTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / parsedItemsPerPage);
    // revalidatePath('/protected/tray_type');
    return totalPage
};

export async function readTrayTypeByPage(itemsPerPage: number | unknown, currentPage: number | unknown, query?: string | unknown) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const parsedItemsPerPage = itemsPerPageSchema.parse(itemsPerPage);
    const parsedCurrentPage = currentPageSchema.parse(currentPage);
    const parsedQuery = querySchema.parse(query);

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        redirect("/tooManyRequests");
    }

    const QUERY = query ? `${query || ''}%` : '%';
    const OFFSET = (parsedCurrentPage - 1) * parsedItemsPerPage;
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['tray_type_uid', 'tray_part_number'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${parsedQuery.replace(/[\s\n\t]/g, '_')}:*`,
                                        },
                                    };
                                })),
                            ],
                        }),
                },
                skip: OFFSET,
                take: parsedItemsPerPage,
            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readTrayTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, parsedItemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM [packing].[tray_type]
                                    WHERE (tray_type_uid like @query OR tray_part_number like @query)
                                    ORDER BY tray_part_number asc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readTrayTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/tray_type');
    return parsedForm.data
};

export async function readTrayType() {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        redirect("/tooManyRequests");
    }

    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findMany({

            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readTrayTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM [packing].[tray_type];
                            `;
            parsedForm = readTrayTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/tray_type');
    return parsedForm.data
};

export async function readTrayTypeUid(tray_part_number: string | unknown) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const parsedInput = trayPartNumberSchema.safeParse({
        tray_part_number: tray_part_number,
    });

    if (!parsedInput.success) {
        throw new Error(parsedInput.error.message)
    };

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        redirect("/tooManyRequests");
    }

    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findFirst({
                where: {
                    tray_part_number: parsedInput.data.tray_part_number,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readTrayTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_part_number', sql.VarChar, parsedInput.data.tray_part_number)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM [packing].[tray_type]
                                    WHERE tray_part_number = @tray_part_number;
                            `;
            parsedForm = readTrayTypeSchema.safeParse(result.recordset[0]);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };

    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/tray_type');
    return parsedForm.data
};

export async function createTrayType(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const tray_part_number = formData.get('tray_part_number');
    const parsedForm = createTrayTypeSchema.safeParse({
        tray_type_uid: (typeof tray_part_number == 'string') ? uuidv5(tray_part_number, UUID5_SECRET) : undefined,
        tray_part_number: formData.get('tray_part_number'),
        tray_max_drive: formData.get('tray_max_drive'),
        tray_type_created_dt: now,
        tray_type_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create tray_type!"
        };
    };

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin' )) {
        return { 
            error: {error: ["Access denied."]},
            message: "Access denied."
        };
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        return { 
            error: {error: ["Too many requests, try again later."]},
            message: "Too many requests, try again later."
        };
    }

    try {

        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_type_uid', sql.VarChar, parsedForm.data.tray_type_uid)
                            .input('tray_part_number', sql.VarChar, parsedForm.data.tray_part_number)
                            .input('tray_max_drive', sql.Int, parsedForm.data.tray_max_drive)
                            .input('tray_type_created_dt', sql.DateTime, parsedForm.data.tray_type_created_dt)
                            .input('tray_type_updated_dt', sql.DateTime, parsedForm.data.tray_type_updated_dt)
                            .query`INSERT INTO [packing].[tray_type] 
                                    (tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt)
                                    VALUES (@tray_type_uid, @tray_part_number, @tray_max_drive, @tray_type_created_dt, @tray_type_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/tray_type');
    return { 
        message: `Successfully created tray_type ${parsedForm.data.tray_type_uid}` 
    }
};


export async function updateTrayType(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const parsedForm = updateTrayTypeSchema.safeParse({
        tray_type_uid: formData.get('tray_type_uid'),
        tray_max_drive: formData.get('tray_max_drive'),
        tray_type_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update tray_type!"
        };
    };

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin' )) {
        return { 
            error: {error: ["Access denied."]},
            message: "Access denied."
        };
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        return { 
            error: {error: ["Too many requests, try again later."]},
            message: "Too many requests, try again later."
        };
    }

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.trayType.update({
                where: {
                    tray_type_uid: parsedForm.data.tray_type_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_type_uid', sql.VarChar, parsedForm.data.tray_type_uid)
                            .input('tray_max_drive', sql.Int, parsedForm.data.tray_max_drive)
                            .input('tray_type_updated_dt', sql.DateTime, parsedForm.data.tray_type_updated_dt)
                            .query`UPDATE [packing].[tray_type] 
                                    SET tray_max_drive = @tray_max_drive, tray_type_updated_dt = @tray_type_updated_dt
                                    WHERE tray_type_uid = @tray_type_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/tray_type');
    return { message: `Successfully updated tray_type ${parsedForm.data.tray_type_uid}` }
};


export async function deleteTrayType(tray_type_uid: string | unknown): StatePromise {

    const parsedForm = deleteTrayTypeSchema.safeParse({
        tray_type_uid: tray_type_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete tray_type!"
        };
    };

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin' )) {
        return { 
            error: {error: ["Access denied."]},
            message: "Access denied."
        };
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        return { 
            error: {error: ["Too many requests, try again later."]},
            message: "Too many requests, try again later."
        };
    }

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.trayType.delete({
                where: {
                    tray_type_uid: parsedForm.data.tray_type_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_type_uid', sql.VarChar, parsedForm.data.tray_type_uid)
                            .query`DELETE FROM [packing].[tray_type] 
                                    WHERE tray_type_uid = @tray_type_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/tray_type');
    return { message: `Successfully deleted tray_type ${parsedForm.data.tray_type_uid}` }
};

export async function readTrayTypeById(tray_type_uid: string | unknown) {
    noStore();

    const parsedInput = deleteTrayTypeSchema.safeParse({
        tray_type_uid: tray_type_uid,
    });

    if (!parsedInput.success) {
        throw new Error(parsedInput.error.message)
    };

    const session = await getServerSession(options);

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    if (await rateLimitByUid(session.user.user_uid, 20, 1000*60)) {
        redirect("/tooManyRequests");
    }

    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findUnique({
                where: {
                    tray_type_uid: parsedInput.data.tray_type_uid,
                }
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readTrayTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_type_uid', sql.VarChar, parsedInput.data.tray_type_uid)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM [packing].[tray_type]
                                    WHERE tray_type_uid = @tray_type_uid;
                            `;
            parsedForm = readTrayTypeSchema.safeParse(result.recordset[0]);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };

    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    return parsedForm.data
};