'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readBoxSchema, createBoxSchema, updateBoxSchema, deleteBoxSchema, TReadBoxSchema, shipBoxSchema, checkBoxShippableSchema, shippedBoxHistorySchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';
import { readBoxTypeUid } from '@/app/_actions/box_type';
import { readShipdocUid } from '@/app/_actions/shipdoc';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readBoxTotalPage(itemsPerPage: number, query?: string) {
    noStore();
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.box.findMany({
                include: {
                    fk_box_type_uid: {
                        select: {
                            box_part_number: true,
                            box_max_tray: true,
                        },
                    },
                    fk_shipdoc_uid: {
                        select: {
                            shipdoc_number: true,
                            shipdoc_contact: true,
                        },
                    },
                },
                where: {
                    box_status: 'active',
                    ...(query &&
                        {
                            OR: [
                                ...(['box_uid', 'box_type_uid', 'shipdoc_uid'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                                ...(['box_part_number'].map((e) => {
                                    return {
                                        fk_box_type_uid: {
                                            [e]: {
                                                search: `${query}:*`,
                                            },
                                        },
                                    };
                                })),
                                ...(['shipdoc_number', 'shipdoc_contact'].map((e) => {
                                    return {
                                        fk_shipdoc_uid: {
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
            parsedForm = readBoxSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`
                                    SELECT b.box_uid, b.box_type_uid, b.shipdoc_uid, b.box_status, b.box_created_dt, b.box_updated_dt,
                                    bt.box_part_number, bt.box_max_tray,
                                    s.shipdoc_number, s.shipdoc_contact
                                    FROM "packing"."box" b
                                    INNER JOIN "packing"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                    INNER JOIN "packing"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                    WHERE b.box_status = 'active'
                                    AND (b.box_uid like @query
                                        OR bt.box_part_number like @query OR s.shipdoc_number like @query OR s.shipdoc_contact like @query
                                    );
                            `;
            parsedForm = readBoxSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/box');
    return totalPage
};

export async function readBoxByPage(itemsPerPage: number, currentPage: number, query?: string) {
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
            const result = await prisma.$queryRaw`
                                WITH gt AS (
                                    SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                    FROM "packing"."tray"
                                    GROUP BY box_uid
                                )
                                SELECT b.box_uid, b.box_status, b.box_created_dt, b.box_updated_dt,
                                bt.box_part_number, bt.box_max_tray,
                                s.shipdoc_number, s.shipdoc_contact,
                                CAST(COALESCE(gt.box_current_tray, 0) as INT) box_current_tray
                                FROM "packing"."box" b
                                INNER JOIN "packing"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                INNER JOIN "packing"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                LEFT JOIN gt ON b.box_uid = gt.box_uid
                                WHERE b.box_status = 'active'
                                AND (
                                    b.box_uid||'' like ${QUERY}
                                    OR bt.box_part_number like ${QUERY} OR s.shipdoc_number like ${QUERY} OR s.shipdoc_contact like ${QUERY}
                                )
                                ORDER BY b.box_updated_dt desc
                                OFFSET ${OFFSET} ROWS
                                FETCH NEXT ${itemsPerPage} ROWS ONLY;
                            `;
            parsedForm = readBoxSchema.array().safeParse(result);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`
                                    WITH gt AS (
                                        SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                        FROM "packing"."tray"
                                        GROUP BY box_uid
                                    )
                                    SELECT b.box_uid, b.box_status, b.box_created_dt, b.box_updated_dt,
                                    bt.box_part_number, bt.box_max_tray,
                                    s.shipdoc_number, s.shipdoc_contact,
                                    CAST(COALERSE(gt.box_current_tray, 0) as INT) box_current_tray
                                    FROM "packing"."box" b
                                    INNER JOIN "packing"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                    INNER JOIN "packing"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                    LEFT JOIN gt ON b.box_uid = gt.box_uid
                                    WHERE b.box_status = 'active'
                                    AND (b.box_uid like @query
                                        OR bt.box_part_number like @query OR s.shipdoc_number like @query OR s.shipdoc_contact like @query
                                    )
                                    ORDER BY b.box_updated_dt desc
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = readBoxSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    revalidatePath('/box');
    return parsedForm.data
};


export async function readShippedBoxTotalPage(itemsPerPage: number, query?: string) {
    noStore();
    const QUERY = query ? `${query || ''}%` : '%';
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.lot.findMany({
                select: {
                    lot_id: true,
                    lot_qty: true,
                    fk_tray_uid: {
                        select: {
                            tray_uid: true,
                            fk_box_uid: {
                                select: {
                                    box_uid: true,
                                    box_status: true,
                                    box_created_dt: true,
                                    box_updated_dt: true,
                                    fk_shipdoc_uid: {
                                        select: {
                                            shipdoc_number: true,
                                            shipdoc_contact: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                where: {
                    fk_tray_uid: {
                        fk_box_uid: {
                            box_status: 'shipped',
                        },
                    },
                    ...(query &&
                        {
                            OR: [
                                ...(['lot_id'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                                ...(['tray_uid'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            [e]: {
                                                search: `${query}:*`,
                                            },
                                        },
                                    };
                                })),
                                ...(['box_uid'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            fk_box_uid: {
                                                [e]: {
                                                    search: `${query}:*`,
                                                },
                                            },
                                        },
                                    };
                                })),
                                ...(['shipdoc_number', 'shipdoc_contact'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            fk_box_uid: {
                                                fk_shipdoc_uid: {
                                                    [e]: {
                                                        search: `${query}:*`,
                                                    },
                                                },
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
            parsedForm = readBoxSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('query', sql.VarChar, QUERY)
                            .query`
                                SELECT b.box_uid, b.box_status, b.box_created_dt, b.box_updated_dt,
                                s.shipdoc_number, s.shipdoc_contact,
                                t.tray_uid,
                                l.lot_id, l.lot_qty
                                FROM "packing"."lot" l
                                INNER JOIN "packing"."tray" t ON l.tray_uid = t.tray_uid
                                INNER JOIN "packing"."box" b ON t.tray_uid = b.tray_uid
                                INNER JOIN "packing"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                WHERE b.box_status = 'shipped'
                                AND (b.box_uid like @query
                                    OR s.shipdoc_number like @query OR s.shipdoc_contact like @query
                                    OR t.tray_uid like @query
                                    OR l.lot_id like @query
                                )
                            `;
            parsedForm = readBoxSchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }
    const totalPage = Math.ceil(parsedForm.data.length / itemsPerPage);
    revalidatePath('/history');
    revalidatePath('/protected/history');
    return totalPage
};


export async function readShippedBoxByPage(itemsPerPage: number, currentPage: number, query?: string) {
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
                select: {
                    lot_id: true,
                    lot_qty: true,
                    fk_tray_uid: {
                        select: {
                            tray_uid: true,
                            fk_box_uid: {
                                select: {
                                    box_uid: true,
                                    box_status: true,
                                    box_created_dt: true,
                                    box_updated_dt: true,
                                    fk_shipdoc_uid: {
                                        select: {
                                            shipdoc_number: true,
                                            shipdoc_contact: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: [
                    {
                        fk_tray_uid: {
                            fk_box_uid: {
                                box_updated_dt: 'desc',
                            },
                        },
                    },
                    {
                        fk_tray_uid: {
                            fk_box_uid: {
                                box_uid: 'asc',
                            },
                        },
                    },
                    {
                        fk_tray_uid: {
                            tray_uid: 'asc',
                        },
                    },
                    {
                        lot_id: 'asc',
                    },
                ],
                where: {
                    fk_tray_uid: {
                        fk_box_uid: {
                            box_status: 'shipped',
                        },
                    },
                    ...(query &&
                        {
                            OR: [
                                ...(['lot_id'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${query}:*`,
                                        },
                                    };
                                })),
                                ...(['tray_uid'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            [e]: {
                                                search: `${query}:*`,
                                            },
                                        },
                                    };
                                })),
                                ...(['box_uid'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            fk_box_uid: {
                                                [e]: {
                                                    search: `${query}:*`,
                                                },
                                            },
                                        },
                                    };
                                })),
                                ...(['shipdoc_number', 'shipdoc_contact'].map((e) => {
                                    return {
                                        fk_tray_uid: {
                                            fk_box_uid: {
                                                fk_shipdoc_uid: {
                                                    [e]: {
                                                        search: `${query}:*`,
                                                    },
                                                },
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
            parsedForm = shippedBoxHistorySchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`
                                    SELECT b.box_uid, b.box_status, b.box_created_dt, b.box_updated_dt,
                                    s.shipdoc_number, s.shipdoc_contact,
                                    t.tray_uid,
                                    l.lot_id, l.lot_qty
                                    FROM "packing"."lot" l
                                    INNER JOIN "packing"."tray" t ON l.tray_uid = t.tray_uid
                                    INNER JOIN "packing"."box" b ON t.tray_uid = b.tray_uid
                                    INNER JOIN "packing"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                    WHERE b.box_status = 'shipped'
                                    AND (b.box_uid like @query
                                        OR s.shipdoc_number like @query OR s.shipdoc_contact like @query
                                        OR t.tray_uid like @query
                                        OR l.lot_id like @query
                                    )
                                    ORDER BY b.box_updated_dt desc, b.box_uid, t.tray_uid, l.lot_id
                                    OFFSET @offset ROWS
                                    FETCH NEXT @limit ROWS ONLY;
                            `;
            parsedForm = shippedBoxHistorySchema.array().safeParse(result.recordset);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };
    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    revalidatePath('/history');
    revalidatePath('/protected/history');
    return parsedForm.data
};


export async function createBox(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const [{box_type_uid}, {shipdoc_uid}] = await Promise.all ([
        await readBoxTypeUid( formData.get('box_part_number') as string ),
        await readShipdocUid( formData.get('shipdoc_number') as string ),
    ]);

    const parsedForm = createBoxSchema.safeParse({
        box_uid: uuidv5((box_type_uid as string + shipdoc_uid as string + now.toString()), UUID5_SECRET),
        box_type_uid: box_type_uid,
        shipdoc_uid: shipdoc_uid,
        box_status: 'active',
        box_created_dt: now,
        box_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create box!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.box.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('box_type_uid', sql.VarChar, parsedForm.data.box_type_uid)
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('box_status', sql.VarChar, parsedForm.data.box_status)
                            .input('box_created_dt', sql.DateTime, parsedForm.data.box_created_dt)
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.box_updated_dt)
                            .query`INSERT INTO "packing"."box" 
                                    (box_uid, box_type_uid, shipdoc_uid, box_status, box_created_dt, box_updated_dt)
                                    VALUES (@box_uid, @box_type_uid, @shipdoc_uid, @box_status, @box_created_dt, @box_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box');
    return { 
        message: `Successfully created box ${parsedForm.data.box_uid}` 
    }
};


export async function updateBox(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const parsedForm = updateBoxSchema.safeParse({
        box_uid: formData.get('box_uid'),
        shipdoc_uid: formData.get('shipdoc_uid'),
        box_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update box!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.box.update({
                where: {
                    box_uid: parsedForm.data.box_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.box_updated_dt)
                            .query`UPDATE "packing"."box" 
                                    SET shipdoc_uid = @shipdoc_uid, box_updated_dt = @box_updated_dt
                                    WHERE box_uid = @box_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box');
    return { message: `Successfully updated box ${parsedForm.data.box_uid}` }
};


export async function deleteBox(box_uid: string): StatePromise {

    const parsedForm = deleteBoxSchema.safeParse({
        box_uid: box_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete box!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.box.delete({
                where: {
                    box_uid: parsedForm.data.box_uid,
                },
            })
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .query`DELETE FROM "packing"."box" 
                                    WHERE box_uid = @box_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box');
    return { message: `Successfully deleted box ${parsedForm.data.box_uid}` }
};


export async function readBoxById(box_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result: any = await prisma.$queryRaw`
                                WITH gt AS (
                                    SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                    FROM "packing"."tray"
                                    WHERE box_uid = UUID(${box_uid})
                                    GROUP BY box_uid
                                )
                                SELECT b.box_uid, b.box_type_uid, b.box_status, b.shipdoc_uid, b.box_created_dt, b.box_updated_dt,
                                bt.box_part_number, bt.box_max_tray,
                                CAST(COALESCE(gt.box_current_tray, 0) as INT) box_current_tray
                                FROM "packing"."box" b
                                INNER JOIN "packing"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                LEFT JOIN gt ON b.box_uid = gt.box_uid
                                WHERE b.box_uid = UUID(${box_uid});
                            `;
            parsedForm = readBoxSchema.safeParse(result[0]);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .query`
                                    WITH gt AS (
                                        SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                        FROM "packing"."tray"
                                        WHERE box_uid = @box_uid
                                        GROUP BY box_uid
                                    )
                                    SELECT b.box_uid, b.box_status, b.box_type_uid, b.shipdoc_uid, b.box_created_dt, b.box_updated_dt,
                                    bt.box_part_number, bt.box_max_tray,
                                    CAST(COALESCE(t.box_current_tray, 0) as INT) box_current_tray
                                    FROM "packing"."box" b
                                    INNER JOIN "packing"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                    LEFT JOIN t ON b.box_uid = t.box_uid
                                    WHERE b.box_uid = @box_uid;
                            `;
            parsedForm = readBoxSchema.safeParse(result.recordset[0]);
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


export async function readBoxStatusByBoxUid(box_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.box.findUnique({
                select: {
                    box_uid: true,
                    box_status: true,
                },
                where: {
                    box_uid: box_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readBoxSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .query`
                                    SELECT b.box_uid, b.box_status
                                    FROM "packing"."box" b
                                    WHERE b.box_uid = @box_uid;
                            `;
            parsedForm = readBoxSchema.safeParse(result.recordset[0]);
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


export async function readBoxStatusByTrayUid(tray_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.tray.findUnique({
                select: {
                    tray_uid: true,
                    fk_box_uid: {
                        select: {
                            box_uid: true,
                            box_status: true,
                        },
                    },
                },
                where: {
                    tray_uid: tray_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readBoxSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, tray_uid)
                            .query`
                                    SELECT t.tray_uid, b.box_uid, b.box_status
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."box" b ON t.box_uid = b.box_uid
                                    WHERE t.tray_uid = @tray_uid;
                            `;
            parsedForm = readBoxSchema.safeParse(result.recordset[0]);
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


export async function readBoxStatusByLotUid(lot_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.lot.findUnique({
                select: {
                    fk_tray_uid: {
                        select: {
                            fk_box_uid: {
                                select: {
                                    box_uid: true,
                                    box_status: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    lot_uid: lot_uid,
                },
            });
            const flattenResult = flattenNestedObject(result);
            parsedForm = readBoxSchema.safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('lot_uid', sql.VarChar, lot_uid)
                            .query`
                                    SELECT l.lot_uid, t.tray_uid, b.box_uid, b.box_status
                                    FROM "packing"."lot" l
                                    INNER JOIN "packing"."tray" t ON l.tray_uid = t.tray_uid
                                    INNER JOIN "packing"."box" b ON t.box_uid = b.box_uid
                                    WHERE l.lot_uid = @lot_uid;
                            `;
            parsedForm = readBoxSchema.safeParse(result.recordset[0]);
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


export async function checkBoxShippableById(box_uid: string) {
    noStore();
    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result: any = await prisma.$queryRaw`
                                    WITH gt AS (
                                        SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                        FROM "packing"."tray"
                                        WHERE box_uid = UUID(${box_uid})
                                        GROUP BY box_uid
                                    ),
                                    gl AS (
                                        SELECT t.box_uid, CAST(SUM(l.lot_qty) as INT) box_current_drive
                                        FROM "packing"."lot" l
                                        INNER JOIN "packing"."tray" t ON l.tray_uid = t.tray_uid
                                        GROUP BY t.box_uid
                                    ) 
                                    SELECT b.box_uid,
                                    CAST(COALESCE(gt.box_current_tray, 0) as INT) box_current_tray,
                                    CAST(COALESCE(gl.box_current_drive, 0) as INT) box_current_drive
                                    FROM "packing"."box" b
                                    LEFT JOIN gt ON b.box_uid = gt.box_uid
                                    LEFT JOIN gl ON b.box_uid = gl.box_uid
                                    WHERE b.box_uid = UUID(${box_uid});
                            `;
            parsedForm = checkBoxShippableSchema.safeParse(result[0]);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .query`
                                    WITH gt AS (
                                        SELECT box_uid, CAST(COUNT(tray_uid) as INT) box_current_tray
                                        FROM "packing"."tray"
                                        WHERE box_uid = @box_uid
                                        GROUP BY box_uid
                                    ),
                                    gl AS (
                                        SELECT t.box_uid, CAST(SUM(l.lot_qty) as INT) box_current_drive
                                        FROM "packing"."lot" l
                                        INNER JOIN "packing"."tray" t ON l.tray_uid = t.tray_uid
                                        GROUP BY t.box_uid
                                    ) 
                                    SELECT b.box_uid,
                                    CAST(COALESCE(gt.box_current_tray, 0) as INT) box_current_tray,
                                    CAST(COALESCE(gl.box_current_drive, 0) as INT) box_current_drive
                                    FROM "packing"."box" b
                                    LEFT JOIN gt ON b.box_uid = gt.box_uid
                                    LEFT JOIN gl ON b.box_uid = gl.box_uid
                                    WHERE b.box_uid = @box_uid;
                            `;
            parsedForm = checkBoxShippableSchema.safeParse(result.recordset[0]);
        }

        if (!parsedForm.success) {
            throw new Error(parsedForm.error.message)
        };

    } 
    catch (err) {
        throw new Error(getErrorMessage(err))
    }

    if (parsedForm.data.box_current_tray === 0) {
        return "Box current tray count is zero."
    }

    if (parsedForm.data.box_current_drive === 0) {
        return "Box current drive count is zero."
    }

    return "Box is shippable."
};


export async function shipBox(box_uid: string): StatePromise {

    const shipStatus = await checkBoxShippableById(box_uid);

    if (shipStatus !== "Box is shippable.") {
        return { 
            error: {error: [shipStatus + " Box is not shippable !"]},
            message: shipStatus + " Box is not shippable !"
        }
    } 

    const now = new Date();

    const parsedForm = shipBoxSchema.safeParse({
        box_uid: box_uid,
        box_status: 'shipped',
        box_updated_dt: now,
    });

    if (!parsedForm.success) {
        return {
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to ship box!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.box.update({
                where: {
                    box_uid: parsedForm.data.box_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('box_status', sql.VarChar, parsedForm.data.box_status)
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.box_updated_dt)
                            .query`UPDATE "packing"."box" 
                                    SET box_status = @box_status, box_updated_dt = @box_updated_dt
                                    WHERE box_uid = @box_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/box');
    return { message: `Successfully shipped box ${parsedForm.data.box_uid}` }
};


export async function undoShipBox(box_uid: string): StatePromise {

    const now = new Date();

    const parsedForm = shipBoxSchema.safeParse({
        box_uid: box_uid,
        box_status: 'active',
        box_updated_dt: now,
    });

    if (!parsedForm.success) {
        return {
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to undo ship box!"
        };
    };

    try {

        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.box.update({
                where: {
                    box_uid: parsedForm.data.box_uid,
                },
                data: parsedForm.data
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('box_status', sql.VarChar, parsedForm.data.box_status)
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.box_updated_dt)
                            .query`UPDATE "packing"."box" 
                                    SET box_status = @box_status, box_updated_dt = @box_updated_dt
                                    WHERE box_uid = @box_uid;
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    revalidatePath('/history');
    revalidatePath('/protected/history');
    return { message: `Successfully undo ship box ${parsedForm.data.box_uid}` }
};