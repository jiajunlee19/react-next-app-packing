'use server'

import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { readBoxSchema, createBoxSchema, updateBoxSchema, deleteBoxSchema, TReadBoxSchema } from "@/app/_libs/zod_server";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import { revalidatePath } from 'next/cache';
import prisma from '@/prisma/prisma';
import { StatePromise, type State } from '@/app/_libs/types';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenNestedObject } from '@/app/_libs/nested_object';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);
const schema = 'packing';
const table = 'box';

export async function readBoxTotalPage(itemsPerPage: number, query?: string) {
    noStore();
    const queryChecked = query && "";
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
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('query', sql.VarChar, `${queryChecked}%`)
                            .query`SELECT b.box_uid, b.box_type_uid, b.shipdoc_uid, b.box_status, b.box_createdAt, b.box_updatedAt,
                                    bt.box_part_number, bt.box_max_tray,
                                    s.shipdoc_number, s.shipdoc_contact
                                    FROM "@schema"."@table" b
                                    INNER JOIN "@schema"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                    INNER JOIN "@schema"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                    WHERE b.box_status = 'active'
                                    AND (b.box_uid like @query OR b.box_type_uid like @query OR b.shipdoc_uid like @query 
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

    const queryChecked = query && "";
    const OFFSET = (currentPage - 1) * itemsPerPage;
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
                skip: OFFSET,
                take: itemsPerPage,
            });
            const flattenResult = result.map((row) => {
                return flattenNestedObject(row)
            });
            parsedForm = readBoxSchema.array().safeParse(flattenResult);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('offset', sql.Int, OFFSET)
                            .input('limit', sql.Int, itemsPerPage)
                            .input('query', sql.VarChar, `${queryChecked}%`)
                            .query`SELECT b.box_uid, b.box_type_uid, b.shipdoc_uid, b.box_status, b.box_createdAt, b.box_updatedAt,
                                    bt.box_part_number, bt.box_max_tray,
                                    s.shipdoc_number, s.shipdoc_contact
                                    FROM "@schema"."@table" b
                                    INNER JOIN "@schema"."box_type" bt ON b.box_type_uid = bt.box_type_uid
                                    INNER JOIN "@schema"."shipdoc" s ON b.shipdoc_uid = s.shipdoc_uid
                                    WHERE b.box_status = 'active'
                                    AND (b.box_uid like @query OR b.box_type_uid like @query OR b.shipdoc_uid like @query 
                                        OR bt.box_part_number like @query OR s.shipdoc_number like @query OR s.shipdoc_contact like @query
                                    )
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

export async function createBox(prevState: State, formData: FormData): StatePromise {

    const now = new Date();

    const parsedForm = createBoxSchema.safeParse({
        box_uid: uuidv5(formData.get('box_type_uid') as string, UUID5_SECRET),
        box_type_uid: formData.get('box_type_uid'),
        shipdoc_uid: formData.get('shipdoc_uid'),
        box_status: 'active',
        box_createdAt: now,
        box_updatedAt: now,
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
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('box_type_uid', sql.VarChar, parsedForm.data.box_type_uid)
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('box_status', sql.VarChar, parsedForm.data.box_status)
                            .input('box_createdAt', sql.DateTime, parsedForm.data.box_createdAt)
                            .input('box_updatedAt', sql.DateTime, parsedForm.data.box_updatedAt)
                            .query`INSERT INTO "@schema"."@table" 
                                    (box_uid, box_type_uid, shipdoc_uid, box_status, box_createdAt, box_updatedAt)
                                    VALUES (@box_uid, @box_type_uid, @shipdoc_uid, @box_status, @box_createdAt, @box_updatedAt);
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
        box_updatedAt: now,
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
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .input('shipdoc_uid', sql.VarChar, parsedForm.data.shipdoc_uid)
                            .input('box_updatedAt', sql.DateTime, parsedForm.data.box_updatedAt)
                            .query`UPDATE "@schema"."@table" 
                                    SET shipdoc_uid = @shipdoc_uid, box_updatedAt = @box_updatedAt
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
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('box_uid', sql.VarChar, parsedForm.data.box_uid)
                            .query`DELETE FROM "@schema"."@table" 
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
            const result = await prisma.box.findUnique({
                where: {
                    box_uid: box_uid,
                }
            });
            parsedForm = readBoxSchema.safeParse(result);
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .query`SELECT box_uid, box_type_uid, shipdoc_uid, box_createdAt, box_updatedAt 
                                    FROM "@schema"."@table"
                                    WHERE box_uid = @box_uid;
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