'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readTrayTypeSchema, createTrayTypeSchema, updateTrayTypeSchema, deleteTrayTypeSchema, TReadTrayTypeSchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readTrayTypeTotalPage(itemsPerPage: number, query?: string) {
    noStore();
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findMany({
                where: {
                    ...(query &&
                        {
                            OR: [
                                ...(['tray_type_uid', 'tray_part_number'].map((e) => {
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
            parsedForm = readTrayTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM "packing"."tray_type"
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
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/protected/tray_type');
    return totalPage
};

export async function readTrayTypeByPage(itemsPerPage: number, currentPage: number, query?: string) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const QUERY = query ? `${query || ''}%` : '%';
    const OFFSET = (currentPage - 1) * itemsPerPage;
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findMany({
                where: {
                    ...(query &&
                        {
                            OR: [
                                ...(['tray_type_uid', 'tray_part_number'].map((e) => {
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
            parsedForm = readTrayTypeSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM "packing"."tray_type"
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

    revalidatePath('/protected/tray_type');
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
                                    FROM "packing"."tray_type";
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

export async function readTrayTypeUid(tray_part_number: string) {
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
            const result = await prisma.trayType.findFirst({
                where: {
                    tray_part_number: tray_part_number,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readTrayTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_part_number', sql.VarChar, tray_part_number)
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM "packing"."tray_type"
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

export async function createTrayType(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const parsedForm = createTrayTypeSchema.safeParse({
        tray_type_uid: uuidv5(formData.get('tray_part_number') as string, UUID5_SECRET),
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
                            .query`INSERT INTO "packing"."tray_type" 
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

    revalidatePath('/protected/tray_type');
    return { 
        message: `Successfully created tray_type ${parsedForm.data.tray_type_uid}` 
    }
};


export async function updateTrayType(prevState: State, formData: FormData): StatePromise {

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
                            .query`UPDATE "packing"."tray_type" 
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

    revalidatePath('/protected/tray_type');
    return { message: `Successfully updated tray_type ${parsedForm.data.tray_type_uid}` }
};


export async function deleteTrayType(tray_type_uid: string): StatePromise {

    const parsedForm = deleteTrayTypeSchema.safeParse({
        tray_type_uid: tray_type_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete tray_type!"
        };
    };

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
                            .query`DELETE FROM "packing"."tray_type" 
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

    revalidatePath('/protected/tray_type');
    return { message: `Successfully deleted tray_type ${parsedForm.data.tray_type_uid}` }
};

export async function readTrayTypeById(tray_type_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.trayType.findUnique({
                where: {
                    tray_type_uid: tray_type_uid,
                }
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readTrayTypeSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .query`SELECT tray_type_uid, tray_part_number, tray_max_drive, tray_type_created_dt, tray_type_updated_dt 
                                    FROM "packing"."tray_type"
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