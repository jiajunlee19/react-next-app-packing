// This is a seed script to load initial placeholder data to database, using "npm run seed"

import { users, lots, trays, boxes, shipdocs, tray_types, box_types } from "@/app/_scripts/data_placeholder";
import { signUpSchema } from "@/app/_libs/zod_auth";
import { parsedEnv } from "@/app/_libs/zod_env";
import prisma from "@/prisma/prisma";
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { getErrorMessage } from "@/app/_libs/error_handler";
import * as bcrypt from 'bcrypt';
import { createLotSchema, createTraySchema, createBoxSchema, createShipdocSchema, createTrayTypeSchema, createBoxTypeSchema } from "@/app/_libs/zod_server";

async function seedUser() {

    const parsedForm = signUpSchema.array().safeParse(users);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.user.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                 pool.request()
                .input('user_uid', sql.VarChar, d.user_uid)
                .input('email', sql.VarChar, d.email)
                .input('password', sql.VarChar, await bcrypt.hash(d.password, 10))
                .input('role', sql.VarChar, d.role)
                .input('user_createdAt', sql.DateTime, d.user_createdAt)
                .input('user_updatedAt', sql.DateTime, d.user_updatedAt)
                .query`INSERT INTO "packing"."user" 
                        (user_uid, email, password, role, user_createdAt, user_updatedAt)
                        VALUES (@user_uid, @email, @password, @role, @user_createdAt, @user_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed users` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedBoxType() {

    const parsedForm = createBoxTypeSchema.array().safeParse(box_types);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.boxType.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('schema', sql.VarChar, 'packing')
                .input('table', sql.VarChar, 'box_type')
                .input('box_type_uid', sql.VarChar, d.box_type_uid)
                .input('box_part_number', sql.VarChar, d.box_part_number)
                .input('box_max_tray', sql.Int, d.box_max_tray)
                .input('box_type_createdAt', sql.DateTime, d.box_type_createdAt)
                .input('box_type_updatedAt', sql.DateTime, d.box_type_updatedAt)
                .query`INSERT INTO "packing"."box_type" 
                        (box_type_uid, box_part_number, box_max_tray, box_type_createdAt, box_type_updatedAt)
                        VALUES (@box_type_uid, @box_part_number, @box_max_tray, @box_type_createdAt, @box_type_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed box_type` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedTrayType() {

    const parsedForm = createTrayTypeSchema.array().safeParse(tray_types);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.trayType.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('tray_type_uid', sql.VarChar, d.tray_type_uid)
                .input('tray_part_number', sql.VarChar, d.tray_part_number)
                .input('tray_max_drive', sql.Int, d.tray_max_drive)
                .input('tray_type_createdAt', sql.DateTime, d.tray_type_createdAt)
                .input('tray_type_updatedAt', sql.DateTime, d.tray_type_updatedAt)
                .query`INSERT INTO "packing"."@tray_type" 
                        (tray_type_uid, tray_part_number, tray_max_drive, tray_type_createdAt, tray_type_updatedAt)
                        VALUES (@tray_type_uid, @tray_part_number, @tray_max_drive, @tray_type_createdAt, @tray_type_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed tray_type` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedShipdoc() {

    const parsedForm = createShipdocSchema.array().safeParse(shipdocs);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.shipdoc.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('shipdoc_uid', sql.VarChar, d.shipdoc_uid)
                .input('shipdoc_number', sql.Int, d.shipdoc_number)
                .input('shipdoc_contact', sql.VarChar, d.shipdoc_contact)
                .input('shipdoc_createdAt', sql.DateTime, d.shipdoc_createdAt)
                .input('shipdoc_updatedAt', sql.DateTime, d.shipdoc_updatedAt)
                .query`INSERT INTO "packing"."shipdoc" 
                        (shipdoc_uid, shipdoc_number, shipdoc_contact, shipdoc_createdAt, shipdoc_updatedAt)
                        VALUES (@shipdoc_uid, @shipdoc_number, @shipdoc_contact, @shipdoc_createdAt, @shipdoc_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed shipdocs` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedBox() {

    const parsedForm = createBoxSchema.array().safeParse(boxes);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.box.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('box_uid', sql.VarChar, d.box_uid)
                .input('box_type_uid', sql.VarChar, d.box_type_uid)
                .input('shipdoc_uid', sql.VarChar, d.shipdoc_uid)
                .input('box_status', sql.VarChar, d.box_status)
                .input('box_createdAt', sql.DateTime, d.box_createdAt)
                .input('box_updatedAt', sql.DateTime, d.box_updatedAt)
                .query`INSERT INTO "packing"."box" 
                        (box_uid, box_type_uid, shipdoc_uid, box_status, box_createdAt, box_updatedAt)
                        VALUES (@box_uid, @box_type_uid, @shipdoc_uid, @box_status, @box_createdAt, @box_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed box` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedTray() {

    const parsedForm = createTraySchema.array().safeParse(trays);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.tray.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('tray_uid', sql.VarChar, d.tray_uid)
                .input('box_uid', sql.Int, d.box_uid)
                .input('tray_type_uid', sql.VarChar, d.tray_type_uid)
                .input('tray_createdAt', sql.DateTime, d.tray_createdAt)
                .input('tray_updatedAt', sql.DateTime, d.tray_updatedAt)
                .query`INSERT INTO "packing"."@tray" 
                        (tray_uid, box_uid, tray_type_uid, tray_createdAt, tray_updatedAt)
                        VALUES (@tray_uid, @box_uid, @tray_type_uid, @tray_createdAt, @tray_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed trays` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function seedLot() {

    const parsedForm = createLotSchema.array().safeParse(lots);

    if(!parsedForm.success) {
        return { error: parsedForm.error.message.split('"message": "').pop()?.split('",')[0] }
    }

    try {
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                await prisma.lot.create({
                    data: d,
                })
            }));
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await Promise.all(parsedForm.data.map( async (d) => {
                pool.request()
                .input('lot_uid', sql.VarChar, d.lot_uid)
                .input('tray_uid', sql.VarChar, d.tray_uid)
                .input('lot_id', sql.VarChar, d.lot_id)
                .input('lot_qty', sql.Int, d.lot_qty)
                .input('lot_createdAt', sql.DateTime, d.lot_createdAt)
                .input('lot_updatedAt', sql.DateTime, d.lot_updatedAt)
                .query`INSERT INTO "packing"."lot" 
                        (lot_uid, tray_uid, lot_id, lot_qty, lot_createdAt, lot_updatedAt)
                        VALUES (@lot_uid, @tray_uid, @lot_id, @lot_qty, @lot_createdAt, @lot_updatedAt);
                `;
            }));
        }
        return { success: `Successfully seed lots` }
    } catch (err) {
        return { error: getErrorMessage(err)}
    }

};

async function main() {
    console.log(await seedUser());
    console.log(await seedBoxType());
    console.log(await seedTrayType());
    console.log(await seedShipdoc());
    console.log(await seedBox());
    console.log(await seedTray());
    console.log(await seedLot());
};

// Run main
main()