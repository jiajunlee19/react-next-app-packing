'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readShipdocSchema, createShipdocSchema, updateShipdocSchema, deleteShipdocSchema, TReadShipdocSchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readShipdocTotalPage(itemsPerPage: number, query?: string) {
    noStore();
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.shipdoc.findMany({
                where: {
                    ...(query &&
                        {
                            OR: [
                                ...(['shipdoc_uid', 'shipdoc_number', 'shipdoc_contact'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
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
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/protected/shipdoc');
    return totalPage
};

export async function readShipdocByPage(itemsPerPage: number, currentPage: number, query?: string) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const OFFSET = (currentPage - 1) * itemsPerPage;
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.shipdoc.findMany({
                where: {
                    ...(query &&
                        {
                            OR: [
                                ...(['shipdoc_uid', 'shipdoc_number', 'shipdoc_contact'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                            ],
                        }),
                },
                skip: OFFSET,
                take: itemsPerPage,
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
                            .input('limit', sql.Int, itemsPerPage)
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

    revalidatePath('/protected/shipdoc');
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

export async function readShipdocUid(shipdoc_number: string) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.shipdoc.findFirst({
                where: {
                    shipdoc_number: shipdoc_number,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readShipdocSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('shipdoc_number', sql.VarChar, shipdoc_number)
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

export async function createShipdoc(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const parsedForm = createShipdocSchema.safeParse({
        shipdoc_uid: uuidv5(formData.get('shipdoc_number') as string, UUID5_SECRET),
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
                            .input('shipdoc_contact', sql.Int, parsedForm.data.shipdoc_contact)
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

    revalidatePath('/protected/shipdoc');
    return { 
        message: `Successfully created shipdoc ${parsedForm.data.shipdoc_uid}` 
    }
};


export async function updateShipdoc(prevState: State, formData: FormData): StatePromise {

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
                            .input('shipdoc_contact', sql.Int, parsedForm.data.shipdoc_contact)
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

    revalidatePath('/protected/shipdoc');
    return { message: `Successfully updated shipdoc ${parsedForm.data.shipdoc_uid}` }
};


export async function deleteShipdoc(shipdoc_uid: string): StatePromise {

    const parsedForm = deleteShipdocSchema.safeParse({
        shipdoc_uid: shipdoc_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete shipdoc!"
        };
    };

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

    revalidatePath('/protected/shipdoc');
    return { message: `Successfully deleted shipdoc ${parsedForm.data.shipdoc_uid}` }
};

export async function readShipdocById(shipdoc_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.shipdoc.findUnique({
                where: {
                    shipdoc_uid: shipdoc_uid,
                }
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readShipdocSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
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