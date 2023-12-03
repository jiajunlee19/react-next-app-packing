import * as bcrypt from 'bcrypt';
import { v5 as uuidv5 } from 'uuid';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { type TSignUpSchema, signUpSchema } from "@/app/_libs/zod_auth";
import { parsedEnv } from '@/app/_libs/zod_env';
import { getErrorMessage } from '@/app/_libs/error_handler';
import prisma from '@/prisma/prisma';

const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);
const schema = 'packing';
const table = 'user';

export async function POST(request: Request) {

    let body: TSignUpSchema = await request.json();

    const now = new Date();

    const parsedForm = signUpSchema.safeParse({
        user_uid: uuidv5(body.email, UUID5_SECRET),
        email: body.email,
        password: body.password,
        role: 'user',
        user_created_dt: now,
        user_updated_dt: now,
    });

    if (!parsedForm.success) {
        return new Response(JSON.stringify({ error: parsedForm.error.message }), {status: 401})
    };

    try {
        
        if (parsedEnv.DB_TYPE === "PRISMA") {
            const result = await prisma.user.create({
                data: parsedForm.data,
            });
        }
        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('user_uid', sql.VarChar, parsedForm.data.user_uid)
                            .input('email', sql.VarChar, parsedForm.data.email)
                            .input('password', sql.VarChar, await bcrypt.hash(parsedForm.data.password, 10))
                            .input('user_created_dt', sql.DateTime, parsedForm.data.user_created_dt)
                            .input('user_updated_dt', sql.DateTime, parsedForm.data.user_updated_dt)
                            .query`INSERT INTO "@schema"."@table" 
                                    (user_uid, email, password, user_created_dt, user_updated_dt)
                                    VALUES (@user_uid, @email, @password, @user_created_dt, @user_updated_dt);
                            `;
        }

        return new Response(JSON.stringify({ success: `Successfully created user ${parsedForm.data.user_uid}` }), {status: 200})
    } 
    catch (err) {
        return new Response(JSON.stringify({ error: getErrorMessage(err) }), {status: 401}) 
    }

};