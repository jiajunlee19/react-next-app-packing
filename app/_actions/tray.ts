'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readTraySchema, createTraySchema, updateTraySchema, deleteTraySchema, TReadTraySchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';
import { readTrayTypeUid } from '@/app/_actions/tray_type';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readTrayTotalPage(itemsPerPage: number, query?: string, box_uid?: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.tray.findMany({
                include: {
                    fk_tray_type_uid: {
                        select: {
                            tray_part_number: true,
                            tray_max_drive: true,
                        },
                    },
                },
                where: {
                    box_uid: box_uid,
                    ...(query &&
                        {
                            OR: [
                                ...(['tray_uid', 'tray_type_uid'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                                ...(['tray_part_number'].map((e) => {
                                    return {
                                        fk_tray_type_uid: {
                                            [e]: {
                                                search: `${query}:*`,
                                            },
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
            parsedForm = readTraySchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .input('query', sql.VarChar, query ? `${query || ''}%` : '%')
                            .query`SELECT t.tray_uid, t.tray_type_uid, t.tray_createdAt, t.tray_updatedAt,
                                    tt.tray_part_number, tt.tray_max_drive,
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                    INNER JOIN "packing"."shipdoc" s ON t.shipdoc_uid = s.shipdoc_uid
                                    WHERE t.box_uid = @box_uid
                                    AND (t.tray_uid like @query OR t.tray_type_uid like @query
                                        OR tt.tray_part_number like @query
                                    );
                            `;
            parsedForm = readTraySchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/box/[box_uid]/tray', 'page');
    return totalPage
};

export async function readTrayByPage(itemsPerPage: number, currentPage: number, query?: string, box_uid?: string) {
    noStore();

    // <dev only> 
    // Artifically delay the response, to view the Suspense fallback skeleton
    // console.log("waiting 3sec")
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // console.log("ok")
    // <dev only>

    const OFFSET = (currentPage - 1) * itemsPerPage;
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.tray.findMany({
                include: {
                    fk_tray_type_uid: {
                        select: {
                            tray_part_number: true,
                            tray_max_drive: true,
                        },
                    },
                },
                where: {
                    box_uid: box_uid,
                    ...(query &&
                        {
                            OR: [
                                ...(['tray_uid', 'tray_type_uid'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                                ...(['tray_part_number'].map((e) => {
                                    return {
                                        fk_tray_type_uid: {
                                            [e]: {
                                                search: `${query}:*`,
                                            },
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
            parsedForm = readTraySchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, query ? `${query || ''}%` : '%')
                            .query`SELECT t.tray_uid, t.tray_type_uid, t.tray_createdAt, t.tray_updatedAt,
                                    tt.tray_part_number, tt.tray_max_drive,
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                    INNER JOIN "packing"."shipdoc" s ON t.shipdoc_uid = s.shipdoc_uid
                                    WHERE t.box_uid = @box_uid
                                    AND (t.tray_uid like @query OR t.tray_type_uid like @query
                                        OR tt.tray_part_number like @query
                                    ORDER BY t.tray_updatedAt desc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readTraySchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    revalidatePath('/box/[box_uid]/tray', 'page');
    return parsedForm.data
};

export async function createTray(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const [{tray_type_uid}] = await Promise.all ([
        await readTrayTypeUid( formData.get('tray_part_number') as string ),
    ]);

    const parsedForm = createTraySchema.safeParse({
        tray_uid: uuidv5((tray_type_uid as string + formData.get('box_uid') as string + now.toString()), UUID5_SECRET),
        box_uid: formData.get('box_uid'),
        tray_type_uid: tray_type_uid,
        tray_createdAt: now,
        tray_updatedAt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create tray!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.tray.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedForm.data.tray_uid)
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('tray_type_uid', sql.VarChar, parsedForm.data.tray_type_uid)
                            .input('tray_createdAt', sql.DateTime, parsedForm.data.tray_createdAt)
                            .input('tray_updatedAt', sql.DateTime, parsedForm.data.tray_updatedAt)
                            .query`INSERT INTO "packing"."tray" 
                                    (tray_uid, box_uid, tray_type_uid, tray_createdAt, tray_updatedAt)
                                    VALUES (@tray_uid, @box_uid, @tray_type_uid, @tray_createdAt, @tray_updatedAt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray', 'page');
    return { 
        message: `Successfully created tray ${parsedForm.data.tray_uid}` 
    }
};


export async function updateTray(tray_uid: string): StatePromise {

    const now = new Date();

    const parsedForm = updateTraySchema.safeParse({
        tray_uid: tray_uid,
        tray_updatedAt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update tray!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.tray.update({
                where: {
                    tray_uid: parsedForm.data.tray_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedForm.data.tray_uid)
                            .input('box_updatedAt', sql.DateTime, parsedForm.data.tray_updatedAt)
                            .query`UPDATE "packing"."tray" 
                                    SET tray_updatedAt = @tray_updatedAt
                                    WHERE tray_uid = @tray_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray', 'page');
    return { message: `Successfully updated tray ${parsedForm.data.tray_uid}` }
};


export async function deleteTray(tray_uid: string): StatePromise {

    const parsedForm = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete tray!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.tray.delete({
                where: {
                    tray_uid: parsedForm.data.tray_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedForm.data.tray_uid)
                            .query`DELETE FROM "packing"."tray" 
                                    WHERE tray_uid = @tray_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray', 'page');
    return { message: `Successfully deleted tray ${parsedForm.data.tray_uid}` }
};

export async function readTrayById(tray_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.tray.findUnique({
                where: {
                    tray_uid: tray_uid,
                }
            });
            parsedForm = readTraySchema.safeParse(result);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, tray_uid)
                            .query`SELECT tray_uid, box_uid, tray_type_uid, tray_createdAt, tray_updatedAt 
                                    FROM "packing"."tray"
                                    WHERE tray_uid = @tray_uid;
                            `;
            parsedForm = readTraySchema.safeParse(result.recordset[0]);
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