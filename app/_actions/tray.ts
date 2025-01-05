'use server'

import { rateLimitByIP, rateLimitByUid } from "@/app/_libs/rate_limit";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/_libs/nextAuth_options";
import { redirect } from "next/navigation";
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readTraySchema, createTraySchema, updateTraySchema, deleteTraySchema, TReadTraySchema, deleteBoxSchema } from "@/app/_libs/zod_server";
import { uuidSchema, itemsPerPageSchema, currentPageSchema, querySchema } from '@/app/_libs/zod_server';
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';
import { readTrayTypeUid } from '@/app/_actions/tray_type';
import { readBoxById, readBoxStatusByBoxUid, readBoxStatusByTrayUid } from '@/app/_actions/box';

const DB_SCHEMA = parsedEnv.DB_SCHEMA;
const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);

export async function readTrayTotalPage(itemsPerPage: number | unknown, query?: string | unknown, box_uid?: string | unknown) {
    noStore();

    const parsedItemsPerPage = itemsPerPageSchema.parse(itemsPerPage);
    const parsedQuery = querySchema.parse(query);

    const parsedInput = deleteBoxSchema.safeParse({
        box_uid: box_uid,
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
                    box_uid: parsedInput.data.box_uid,
                    ...(parsedQuery &&
                        {
                            OR: [
                                ...(['tray_uid', 'tray_type_uid'].map((e) => {
                                    return {
                                        [e]: {
                                            search: `${parsedQuery.replace(/[\s\n\t]/g, '_')}:*`,
                                        },
                                    };
                                })),
                                ...(['tray_part_number'].map((e) => {
                                    return {
                                        fk_tray_type_uid: {
                                            [e]: {
                                                search: `${parsedQuery.replace(/[\s\n\t]/g, '_')}:*`,
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
                            .input('box_uid', sql.VarChar, parsedInput.data.box_uid)
                            .input('query', sql.VarChar, QUERY)
                            .query`SELECT t.box_uid, t.tray_uid, t.tray_type_uid, t.tray_created_dt, t.tray_updated_dt,
                                    tt.tray_part_number, tt.tray_max_drive,
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
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
    const totalPage = Math.ceil(parsedForm.data.length / parsedItemsPerPage);
    // revalidatePath('/authenticated/box/[box_uid]/tray', 'page');
    return totalPage
};

export async function readTrayByPage(itemsPerPage: number | unknown, currentPage: number | unknown, query?: string | unknown, box_uid?: string | unknown) {
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

    const parsedInput = deleteBoxSchema.safeParse({
        box_uid: box_uid,
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
            const result = await prisma.$queryRaw`
                                WITH l AS (
                                    SELECT tray_uid, CAST(SUM(lot_qty) as INT) tray_current_drive
                                    FROM "packing"."lot" 
                                    GROUP BY tray_uid
                                )
                                SELECT t.box_uid, t.tray_uid, t.tray_created_dt, t.tray_updated_dt,
                                tt.tray_part_number, tt.tray_max_drive,
                                CAST(COALESCE(l.tray_current_drive, 0) as INT) tray_current_drive
                                FROM "packing"."tray" t
                                INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                LEFT JOIN l ON t.tray_uid = l.tray_uid
                                WHERE t.box_uid = UUID(${parsedInput.data.box_uid})
                                AND (t.tray_uid||'' like ${QUERY}
                                    OR tt.tray_part_number like ${QUERY}
                                )
                                ORDER BY t.tray_updated_dt desc
                                OFFSET ${OFFSET} ROWS
                                FETCH NEXT ${parsedItemsPerPage} ROWS ONLY;
                            `;
            parsedForm = readTraySchema.array().safeParse(result);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('box_uid', sql.VarChar, box_uid)
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, parsedItemsPerPage)
                            .input('query', sql.VarChar, QUERY)
                            .query`
                                    WITH l AS (
                                        SELECT tray_uid, CAST(SUM(lot_qty) as INT) tray_current_drive
                                        FROM "packing"."lot" 
                                        GROUP BY tray_uid
                                    )
                                    SELECT t.box_uid, t.tray_uid, t.tray_created_dt, t.tray_updated_dt,
                                    tt.tray_part_number, tt.tray_max_drive,
                                    CAST(COALESCE(l.tray_current_drive, 0) as INT) tray_current_drive
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                    LEFT JOIN l ON t.tray_uid = l.tray_uid
                                    WHERE t.box_uid = @box_uid
                                    AND (t.tray_uid like @query OR t.tray_type_uid like @query
                                        OR tt.tray_part_number like @query
                                    )
                                    ORDER BY t.tray_updated_dt desc
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

    // revalidatePath('/authenticated/box/[box_uid]/tray', 'page');
    return parsedForm.data
};

export async function createTray(prevState: State | unknown, formData: FormData | unknown): StatePromise {

    if (!(formData instanceof FormData)) {
        return { 
            error: {error: ["Invalid input provided !"]},
            message: "Invalid input provided !"
        };  
    };

    const now = new Date();

    const tray_part_number = formData.get('tray_part_number');
    const box_uid = formData.get('box_uid');

    const [{tray_type_uid}, {box_status}] = await Promise.all ([
        await readTrayTypeUid(typeof tray_part_number == "string" ? tray_part_number : undefined ),
        await readBoxStatusByBoxUid(typeof box_uid == "string" ? box_uid : undefined),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to create tray !"]},
            message: "Given box is not active. Failed to create tray !"
        }
    };

    const parsedForm = createTraySchema.safeParse({
        tray_uid: (typeof tray_type_uid == "string" && typeof box_uid == "string") ? uuidv5(tray_type_uid + box_uid + now.toString(), UUID5_SECRET) : undefined,
        box_uid: formData.get('box_uid'),
        tray_type_uid: tray_type_uid,
        tray_created_dt: now,
        tray_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to create tray!"
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

        // Return error if exceed box max tray
        const {box_current_tray, box_max_tray} = await readBoxById(parsedForm.data.box_uid);
        if (typeof box_current_tray == "undefined" || typeof box_max_tray == "undefined" || (box_current_tray + 1) > box_max_tray) {
            return { 
                error: {error: ["Exceeded max tray count in the box, failed to create new tray !"]},
                message: "Exceeded max tray count in the box, failed to create new tray !"
            }
        }

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
                            .input('tray_created_dt', sql.DateTime, parsedForm.data.tray_created_dt)
                            .input('tray_updated_dt', sql.DateTime, parsedForm.data.tray_updated_dt)
                            .query`INSERT INTO "packing"."tray" 
                                    (tray_uid, box_uid, tray_type_uid, tray_created_dt, tray_updated_dt)
                                    VALUES (@tray_uid, @box_uid, @tray_type_uid, @tray_created_dt, @tray_updated_dt);
                            `;
        }
    } 
    catch (err) {
        return { 
            error: {error: [getErrorMessage(err)]},
            message: getErrorMessage(err)
        }
    }

    // revalidatePath('/authenticated/box/[box_uid]/tray', 'page');
    return { 
        message: `Successfully created tray ${parsedForm.data.tray_uid}` 
    }
};


export async function updateTray(tray_uid: string | unknown): StatePromise {

    const parsedInput = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
    });

    if (!parsedInput.success) {
        throw new Error(parsedInput.error.message)
    };

    const now = new Date();

    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(parsedInput.data.tray_uid),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to update tray !"]},
            message: "Given box is not active. Failed to update tray !"
        }
    };

    const parsedForm = updateTraySchema.safeParse({
        tray_uid: tray_uid,
        tray_updated_dt: now,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to update tray!"
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
                            .input('box_updated_dt', sql.DateTime, parsedForm.data.tray_updated_dt)
                            .query`UPDATE "packing"."tray" 
                                    SET tray_updated_dt = @tray_updated_dt
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

    // revalidatePath('/authenticated/box/[box_uid]/tray', 'page');
    return { message: `Successfully updated tray ${parsedForm.data.tray_uid}` }
};


export async function deleteTray(tray_uid: string | unknown): StatePromise {
    
    const parsedInput = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
    });

    if (!parsedInput.success) {
        throw new Error(parsedInput.error.message)
    };
    
    const [{box_status}] = await Promise.all ([
        await readBoxStatusByTrayUid(parsedInput.data.tray_uid),
    ]);

    if (box_status !== 'active') {
        return { 
            error: {error: ["Given box is not active. Failed to delete tray !"]},
            message: "Given box is not active. Failed to delete tray !"
        }
    };

    const parsedForm = deleteTraySchema.safeParse({
        tray_uid: tray_uid,
    });

    if (!parsedForm.success) {
        return { 
            error: parsedForm.error.flatten().fieldErrors,
            message: "Invalid input provided, failed to delete tray!"
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

    // revalidatePath('/authenticated/box/[box_uid]/tray', 'page');
    return { message: `Successfully deleted tray ${parsedForm.data.tray_uid}` }
};

export async function readTrayById(tray_uid: string | unknown) {
    noStore();

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

    let parsedForm;
    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result: any = await prisma.$queryRaw`
                                WITH gl AS (
                                    SELECT tray_uid, CAST(SUM(lot_qty) as INT) tray_current_drive
                                    FROM "packing"."lot" 
                                    WHERE tray_uid = UUID(${parsedInput.data.tray_uid})
                                    GROUP BY tray_uid
                                )
                                SELECT t.tray_uid, t.tray_type_uid, t.tray_created_dt, t.tray_updated_dt,
                                tt.tray_part_number, tt.tray_max_drive,
                                CAST(COALESCE(gl.tray_current_drive, 0) as INT) tray_current_drive
                                FROM "packing"."tray" t
                                INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                LEFT JOIN gl ON t.tray_uid = gl.tray_uid
                                WHERE t.tray_uid = UUID(${parsedInput.data.tray_uid});
                            `;
            parsedForm = readTraySchema.safeParse(result[0]);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('tray_uid', sql.VarChar, parsedInput.data.tray_uid)
                            .query`
                                    WITH gl AS (
                                        SELECT tray_uid, CAST(SUM(lot_qty) as INT) tray_current_drive
                                        FROM "packing"."lot" 
                                        WHERE tray_uid = @tray_uid
                                        GROUP BY tray_uid
                                    )
                                    SELECT t.tray_uid, t.tray_type_uid, t.tray_created_dt, t.tray_updated_dt,
                                    tt.tray_part_number, tt.tray_max_drive,
                                    CAST(COALESCE(gl.tray_current_drive, 0) as INT) tray_current_drive
                                    FROM "packing"."tray" t
                                    INNER JOIN "packing"."tray_type" tt ON t.tray_type_uid = tt.tray_type_uid
                                    LEFT JOIN gl ON t.tray_uid = gl.tray_uid
                                    WHERE t.tray_uid = @tray_uid;
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