'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readLotSchema, createLotSchema, updateLotSchema, deleteLotSchema, TReadLotSchema, deleteTraySchema } from "@/app/_libs/zod_server";
import { itemsPerPageSchema, currentPageSchema, querySchema } from '@/app/_libs/zod_server';
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

export async function readLotTotalPage(itemsPerPage: number | unknown, query?: string | unknown, tray_uid?: string | unknown) {
    noStore();
    
    const parsedItemsPerPage = itemsPerPageSchema.parse(itemsPerPage);
    const parsedQuery = querySchema.parse(query);

    const parsedInput = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
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

    const QUERY = parsedQuery ? `${parsedQuery || ''}%` : '%';
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
                    tray_uid: parsedInput.data.tray_uid,
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['lot_uid', 'lot_id'].map((e) => {
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
            parsedForm = readLotSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedInput.data.tray_uid)
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
    const totalPage = Math.ceil(parsedForm.data.length / parsedItemsPerPage);
    // revalidatePath('/authenticated/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return totalPage
};

export async function readLotByPage(itemsPerPage: number | unknown, currentPage: number | unknown, query?: string, tray_uid?: string | unknown) {
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

    const parsedInput = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
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

    const QUERY = parsedQuery ? `${parsedQuery || ''}%` : '%';
    const OFFSET = (parsedCurrentPage - 1) * parsedItemsPerPage;
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
                    tray_uid: parsedInput.data.tray_uid,
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['lot_uid', 'lot_id'].map((e) => {
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
            parsedForm = readLotSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedInput.data.tray_uid)
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, parsedItemsPerPage)
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

    // revalidatePath('/authenticated/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return parsedForm.data
};

export async function createLot(prevState: State | unknown, formData: FormData | unknown): StatePromise {
    
    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const tray_uid = formData.get('tray_uid');
    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(typeof tray_uid == "string" ? tray_uid : undefined),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to create Lot !"]},
            message: "Given box is not active. Failed to create Lot !"
        }
    };

    const tray_id = formData.get('tray_id');
    const lot_id = formData.get('lot_id');
    const parsedForm = createLotSchema.safeParse({
        lot_uid: (typeof tray_id == "string" && typeof lot_id == "string") ? uuidv5(tray_id + lot_id + now.toString(), UUID5_SECRET) : undefined,
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

        // Return error if exceed tray max drive
        const {tray_current_drive, tray_max_drive} = await readTrayById(parsedForm.data.tray_uid);
        if (!tray_current_drive || !tray_max_drive || (tray_current_drive + parsedForm.data.lot_qty) > tray_max_drive) {
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

    // revalidatePath('/authenticated/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { 
        message: `Successfully created lot ${parsedForm.data.lot_uid}` 
    }
};


export async function updateLot(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const tray_uid = formData.get('tray_uid');
    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(typeof tray_uid == "string" ? tray_uid : undefined),
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

    // revalidatePath('/authenticated/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { message: `Successfully updated lot ${parsedForm.data.lot_uid}` }
};


export async function deleteLot(lot_uid: string | unknown): StatePromise {

    const parsedForm = deleteLotSchema.safeParse({
        lot_uid: lot_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete lot!"
        };
    };

    const [{box_status}] = await Promise.all ([
        await readBoxStatusByLotUid(parsedForm.data.lot_uid),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to delete Lot !"]},
            message: "Given box is not active. Failed to delete Lot !"
        }
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

    // revalidatePath('/authenticated/box/[box_uid]/tray/[tray_uid]/lot', 'page');
    return { message: `Successfully deleted lot ${parsedForm.data.lot_uid}` }
};

export async function readLotById(lot_uid: string | unknown) {
    noStore();

    const parsedInput = deleteLotSchema.safeParse({
        lot_uid: lot_uid,
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
            const result = await prisma.lot.findUnique({
                where: {
                    lot_uid: parsedInput.data.lot_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readLotSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, parsedInput.data.lot_uid)
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