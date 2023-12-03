'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readLotSchema, createLotSchema, updateLotSchema, deleteLotSchema, TReadLotSchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';
import { readTrayById } from '@/app/_actions/tray';
import { readBoxStatusByLotUid, readBoxStatusByTrayUid } from '@/app/_actions/box';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readLotTotalPage(itemsPerPage: number, query?: string, tray_uid?: string) {
    noStore();
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.lot.findMany({
                include: {
                    fk_tray_uid: {
                        select: {
                            fk_box_uid: {
                                select: {
                                    box_uid: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    tray_uid: tray_uid,
                    ...(query &&
                        {
                            OR: [
                                ...(['lot_uid', 'lot_id'].map((e) => {
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
            parsedForm = readLotSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, tray_uid)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT b.box_uid, l.tray_uid, l.lot_uid, l.lot_id, l.lot_qty, l.lot_created_dt, l.lot_updated_dt
                                    FROM "packing"."lot" l
                                    INNER JOIN "packing"."box" b ON l.tray_uid = b.tray_uid
                                    WHERE tray_uid = @tray_uid
                                    AND (lot_uid like @query OR lot_id like @query);
                            `;
            parsedForm = readLotSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return totalPage
};

export async function readLotByPage(itemsPerPage: number, currentPage: number, query?: string, tray_uid?: string) {
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
            const result = await prisma.lot.findMany({
                include: {
                    fk_tray_uid: {
                        select: {
                            fk_box_uid: {
                                select: {
                                    box_uid: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    tray_uid: tray_uid,
                    ...(query &&
                        {
                            OR: [
                                ...(['lot_uid', 'lot_id'].map((e) => {
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
            parsedForm = readLotSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, tray_uid)
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT b.box_uid, l.tray_uid, l.lot_uid, l.lot_id, l.lot_qty, l.lot_created_dt, l.lot_updated_dt
                                    FROM "packing"."lot" l
                                    INNER JOIN "packing"."box" b ON l.tray_uid = b.tray_uid
                                    WHERE tray_uid = @tray_uid
                                    AND (lot_uid like @query OR lot_id like @query)
                                    ORDER BY lot_updated_dt desc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readLotSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    revalidatePath('/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return parsedForm.data
};

export async function createLot(prevState: State, formData: FormData): StatePromise {
    
    const now = new Date();

    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(formData.get('tray_uid') as string),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to create Lot !"]},
            message: "Given box is not active. Failed to create Lot !"
        }
    };

    const parsedForm = createLotSchema.safeParse({
        lot_uid: uuidv5((formData.get('tray_id') as string + formData.get('lot_id') as string + now.toString()), UUID5_SECRET),
        tray_uid: formData.get('tray_uid'),
        lot_id: formData.get('lot_id'),
        lot_qty: formData.get('lot_qty'),
        lot_created_dt: now,
        lot_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create lot!"
        };
    };

    try {

        // Return error if exceed tray max drive
        const {tray_current_drive, tray_max_drive} = await readTrayById(parsedForm.data.tray_uid);
        if (tray_current_drive && tray_max_drive && (tray_current_drive + parsedForm.data.lot_qty) > tray_max_drive) {
            return { 
                error: {error: ["Exceeded max drive qty in the tray, failed to create new lot !"]},
                message: "Exceeded max drive qty in the tray, failed to create new lot !"
            }
        }

        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.lot.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, parsedForm.data.lot_uid)
                            .input('tray_uid', sql.VarChar, parsedForm.data.tray_uid)
                            .input('lot_id', sql.VarChar, parsedForm.data.lot_id)
                            .input('lot_qty', sql.Int, parsedForm.data.lot_qty)
                            .input('lot_created_dt', sql.DateTime, parsedForm.data.lot_created_dt)
                            .input('lot_updated_dt', sql.DateTime, parsedForm.data.lot_updated_dt)
                            .query`INSERT INTO "packing"."lot" 
                                    (lot_uid, tray_uid, lot_id, lot_qty, lot_created_dt, lot_updated_dt)
                                    VALUES (@lot_uid, @tray_uid, @lot_id, @lot_qty, @lot_created_dt, @lot_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { 
        message: `Successfully created lot ${parsedForm.data.lot_uid}` 
    }
};


export async function updateLot(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(formData.get('tray_uid') as string),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to create Lot !"]},
            message: "Given box is not active. Failed to create Lot !"
        }
    };

    const parsedForm = updateLotSchema.safeParse({
        lot_uid: formData.get('lot_uid'),
        lot_qty: formData.get('lot_qty'),
        lot_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update lot!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.lot.update({
                where: {
                    lot_uid: parsedForm.data.lot_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, parsedForm.data.lot_uid)
                            .input('lot_qty', sql.Int, parsedForm.data.lot_qty)
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.lot_updated_dt)
                            .query`UPDATE "packing"."lot" 
                                    SET lot_qty = @lot_qty, lot_updated_dt = @lot_updated_dt
                                    WHERE lot_uid = @lot_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { message: `Successfully updated lot ${parsedForm.data.lot_uid}` }
};


export async function deleteLot(lot_uid: string): StatePromise {

    const [{box_status}] = await Promise.all ([
        await readBoxStatusByLotUid(lot_uid),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to delete Lot !"]},
            message: "Given box is not active. Failed to delete Lot !"
        }
    };

    const parsedForm = deleteLotSchema.safeParse({
        lot_uid: lot_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete lot!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.lot.delete({
                where: {
                    lot_uid: parsedForm.data.lot_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, parsedForm.data.lot_uid)
                            .query`DELETE FROM "packing"."lot" 
                                    WHERE lot_uid = @lot_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { message: `Successfully deleted lot ${parsedForm.data.lot_uid}` }
};

export async function readLotById(lot_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.lot.findUnique({
                where: {
                    lot_uid: lot_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readLotSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, lot_uid)
                            .query`SELECT lot_uid, lot_id, lot_qty, lot_created_dt, lot_updated_dt 
                                    FROM "packing"."lot"
                                    WHERE lot_uid = @lot_uid;
                            `;
            parsedForm = readLotSchema.safeParse(result.recordset[0]);
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