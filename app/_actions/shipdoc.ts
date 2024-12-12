'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readShipdocSchema, createShipdocSchema, updateShipdocSchema, deleteShipdocSchema, TReadShipdocSchema, shipdocNumberSchema } from "@/app/_libs/zod_server";
import { uuidSchema, itemsPerPageSchema, currentPageSchema, querySchema } from '@/app/_libs/zod_server';
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readShipdocTotalPage(itemsPerPage: number | unknown, query?: string | unknown) {
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
            const result = await prisma.shipdoc.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['shipdoc_uid', 'shipdoc_number', 'shipdoc_contact'].map((e) => {
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
            parsedForm = readShipdocSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt 
                                    FROM "packing"."shipdoc"
                                    WHERE (shipdoc_uid like @query OR shipdoc_number like @query OR shipdoc_contact like @query);
                            `;
            parsedForm = readShipdocSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / parsedItemsPerPage);
    // revalidatePath('/protected/shipdoc');
    return totalPage
};

export async function readShipdocByPage(itemsPerPage: number | unknown, currentPage: number | unknown, query?: string | unknown) {
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
            const result = await prisma.shipdoc.findMany({
                where: {
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['shipdoc_uid', 'shipdoc_number', 'shipdoc_contact'].map((e) => {
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
            parsedForm = readShipdocSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, parsedItemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt 
                                    FROM "packing"."shipdoc"
                                    WHERE (shipdoc_uid like @query OR shipdoc_number like @query OR shipdoc_contact like @query)
                                    ORDER BY shipdoc_number asc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readShipdocSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/shipdoc');
    return parsedForm.data
};

export async function readShipdoc() {
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
            const result = await prisma.shipdoc.findMany({

            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readShipdocSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .query`SELECT shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt 
                                    FROM "packing"."shipdoc";
                            `;
            parsedForm = readShipdocSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/shipdoc');
    return parsedForm.data
};

export async function readShipdocUid(shipdoc_number: string | unknown) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const parsedInput = shipdocNumberSchema.safeParse({
        shipdoc_number: shipdoc_number,
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
            const result = await prisma.shipdoc.findFirst({
                where: {
                    shipdoc_number: parsedInput.data.shipdoc_number,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readShipdocSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_number', sql.VarChar, parsedInput.data.shipdoc_number)
                            .query`SELECT shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt 
                                    FROM "packing"."shipdoc"
                                    WHERE shipdoc_number = @shipdoc_number;
                            `;
            parsedForm = readShipdocSchema.safeParse(result.recordset[0]);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };

    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    // revalidatePath('/protected/shipdoc');
    return parsedForm.data
};

export async function createShipdoc(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const shipdoc_number = formData.get('shipdoc_number');
    const parsedForm = createShipdocSchema.safeParse({
        shipdoc_uid: (typeof shipdoc_number == 'string') ? uuidv5(shipdoc_number, UUID5_SECRET) : undefined,
        shipdoc_number: formData.get('shipdoc_number'),
        shipdoc_contact: formData.get('shipdoc_contact'),
        shipdoc_created_dt: now,
        shipdoc_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create shipdoc!"
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
            const result = await prisma.shipdoc.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('shipdoc_number', sql.VarChar, parsedForm.data.shipdoc_number)
                            .input('shipdoc_contact', sql.VarChar, parsedForm.data.shipdoc_contact)
                            .input('shipdoc_created_dt', sql.DateTime, parsedForm.data.shipdoc_created_dt)
                            .input('shipdoc_updated_dt', sql.DateTime, parsedForm.data.shipdoc_updated_dt)
                            .query`INSERT INTO "packing"."shipdoc"
                                    (shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt)
                                    VALUES (@shipdoc_uid, @shipdoc_number, @shipdoc_contact, @shipdoc_created_dt, @shipdoc_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/shipdoc');
    return { 
        message: `Successfully created shipdoc ${parsedForm.data.shipdoc_uid}` 
    }
};


export async function updateShipdoc(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const parsedForm = updateShipdocSchema.safeParse({
        shipdoc_uid: formData.get('shipdoc_uid'),
        shipdoc_contact: formData.get('shipdoc_contact'),
        shipdoc_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update shipdoc!"
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
            const result = await prisma.shipdoc.update({
                where: {
                    shipdoc_uid: parsedForm.data.shipdoc_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('shipdoc_contact', sql.VarChar, parsedForm.data.shipdoc_contact)
                            .input('shipdoc_updated_dt', sql.DateTime, parsedForm.data.shipdoc_updated_dt)
                            .query`UPDATE "packing"."shipdoc"
                                    SET shipdoc_contact = @shipdoc_contact, shipdoc_updated_dt = @shipdoc_updated_dt
                                    WHERE shipdoc_uid = @shipdoc_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/shipdoc');
    return { message: `Successfully updated shipdoc ${parsedForm.data.shipdoc_uid}` }
};


export async function deleteShipdoc(shipdoc_uid: string | unknown): StatePromise {

    const parsedForm = deleteShipdocSchema.safeParse({
        shipdoc_uid: shipdoc_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete shipdoc!"
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
            const result = await prisma.shipdoc.delete({
                where: {
                    shipdoc_uid: parsedForm.data.shipdoc_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .query`DELETE FROM "packing"."shipdoc"
                                    WHERE shipdoc_uid = @shipdoc_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/protected/shipdoc');
    return { message: `Successfully deleted shipdoc ${parsedForm.data.shipdoc_uid}` }
};

export async function readShipdocById(shipdoc_uid: string | unknown) {
    noStore();

    const parsedInput = deleteShipdocSchema.safeParse({
        shipdoc_uid: shipdoc_uid,
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
            const result = await prisma.shipdoc.findUnique({
                where: {
                    shipdoc_uid: parsedInput.data.shipdoc_uid,
                }
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readShipdocSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_uid', sql.VarChar, parsedInput.data.shipdoc_uid)
                            .query`SELECT shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_created_dt, shipdoc_updated_dt 
                                    FROM "packing"."shipdoc"
                                    WHERE shipdoc_uid = @shipdoc_uid;
                            `;
            parsedForm = readShipdocSchema.safeParse(result.recordset[0]);
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