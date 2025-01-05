'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readBoxTypeSchema, createBoxTypeSchema, updateBoxTypeSchema, deleteBoxTypeSchema, boxPartNumberSchema } from "@/app/_libs/zod_server";
import { itemsPerPageSchema, currentPageSchema, querySchema } from '@/app/_libs/zod_server';
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const DB_SCHEMA = parsedEnv.DB_SCHEMA;
const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readBoxTypeTotalPage(itemsPerPage: number | unknown, query?: string | unknown) {
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

    const QUERY = parsedQuery ? `${parsedQuery || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.boxType.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['box_type_uid', 'box_part_number'].map((e) => {
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
            parsedForm = readBoxTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt 
                                    FROM "${DB_SCHEMA}"."box_type"
                                    WHERE (box_type_uid like @query OR box_part_number like @query);
                            `;
            parsedForm = readBoxTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / parsedItemsPerPage);
    // revalidatePath('/protected/box_type');
    return totalPage
};

export async function readBoxTypeByPage(itemsPerPage: number | unknown, currentPage: number | unknown, query?: string | unknown) {
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
    
    const QUERY = parsedQuery ? `${parsedQuery || ''}%` : '%';
    const OFFSET = (parsedCurrentPage - 1) * parsedItemsPerPage;
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.boxType.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['box_type_uid', 'box_part_number'].map((e) => {
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
            parsedForm = readBoxTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, parsedItemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt 
                                    FROM "${DB_SCHEMA}"."box_type"
                                    WHERE (box_type_uid like @query OR box_part_number like @query)
                                    ORDER BY box_part_number asc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readBoxTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/box_type');
    return parsedForm.data
};

export async function readBoxType() {
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
            const result = await prisma.boxType.findMany({

            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readBoxTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .query`SELECT box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt 
                                    FROM "${DB_SCHEMA}"."box_type";
                            `;
            parsedForm = readBoxTypeSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/box_type');
    return parsedForm.data
};

export async function readBoxTypeUid(box_part_number: string | unknown) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const parsedInput = boxPartNumberSchema.safeParse({
        box_part_number: box_part_number,
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
            const result = await prisma.boxType.findFirst({
                where: {
                    box_part_number: parsedInput.data.box_part_number,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readBoxTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_part_number', sql.VarChar, parsedInput.data.box_part_number)
                            .query`SELECT box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt 
                                    FROM "${DB_SCHEMA}"."box_type"
                                    WHERE box_part_number = @box_part_number;
                            `;
            parsedForm = readBoxTypeSchema.safeParse(result.recordset[0]);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };

    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/box_type');
    return parsedForm.data
};

export async function createBoxType(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const box_part_number = formData.get('box_part_number');
    const parsedForm = createBoxTypeSchema.safeParse({
        box_type_uid: (typeof box_part_number == 'string') ? uuidv5(box_part_number, UUID5_SECRET) : undefined,
        box_part_number: formData.get('box_part_number'),
        box_max_tray: formData.get('box_max_tray'),
        box_type_created_dt: now,
        box_type_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create box_type!"
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
            const result = await prisma.boxType.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_type_uid', sql.VarChar, parsedForm.data.box_type_uid)
                            .input('box_part_number', sql.VarChar, parsedForm.data.box_part_number)
                            .input('box_max_tray', sql.Int, parsedForm.data.box_max_tray)
                            .input('box_type_created_dt', sql.DateTime, parsedForm.data.box_type_created_dt)
                            .input('box_type_updated_dt', sql.DateTime, parsedForm.data.box_type_updated_dt)
                            .query`INSERT INTO "${DB_SCHEMA}"."box_type" 
                                    (box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt)
                                    VALUES (@box_type_uid, @box_part_number, @box_max_tray, @box_type_created_dt, @box_type_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/box_type');
    return { 
        message: `Successfully created box_type ${parsedForm.data.box_type_uid}` 
    }
};


export async function updateBoxType(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const parsedForm = updateBoxTypeSchema.safeParse({
        box_type_uid: formData.get('box_type_uid'),
        box_max_tray: formData.get('box_max_tray'),
        box_type_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update box_type!"
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
            const result = await prisma.boxType.update({
                where: {
                    box_type_uid: parsedForm.data.box_type_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_type_uid', sql.VarChar, parsedForm.data.box_type_uid)
                            .input('box_max_tray', sql.Int, parsedForm.data.box_max_tray)
                            .input('box_type_updated_dt', sql.DateTime, parsedForm.data.box_type_updated_dt)
                            .query`UPDATE "${DB_SCHEMA}"."box_type" 
                                    SET box_max_tray = @box_max_tray, box_type_updated_dt = @box_type_updated_dt
                                    WHERE box_type_uid = @box_type_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/box_type');
    return { message: `Successfully updated box_type ${parsedForm.data.box_type_uid}` }
};


export async function deleteBoxType(box_type_uid: string): StatePromise {

    const parsedForm = deleteBoxTypeSchema.safeParse({
        box_type_uid: box_type_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete box_type!"
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
            const result = await prisma.boxType.delete({
                where: {
                    box_type_uid: parsedForm.data.box_type_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_type_uid', sql.VarChar, parsedForm.data.box_type_uid)
                            .query`DELETE FROM "${DB_SCHEMA}"."box_type" 
                                    WHERE box_type_uid = @box_type_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/box_type');
    return { message: `Successfully deleted box_type ${parsedForm.data.box_type_uid}` }
};

export async function readBoxTypeById(box_type_uid: string) {
    noStore();

    const parsedInput = deleteBoxTypeSchema.safeParse({
        box_type_uid: box_type_uid,
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
            const result = await prisma.boxType.findUnique({
                where: {
                    box_type_uid: parsedInput.data.box_type_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readBoxTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_type_uid', sql.VarChar, parsedInput.data.box_type_uid)
                            .query`SELECT box_type_uid, box_part_number, box_max_tray, box_type_created_dt, box_type_updated_dt 
                                    FROM "${DB_SCHEMA}"."box_type"
                                    WHERE box_type_uid = @box_type_uid;
                            `;
            parsedForm = readBoxTypeSchema.safeParse(result.recordset[0]);
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