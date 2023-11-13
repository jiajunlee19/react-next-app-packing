import * as bcrypt from 'bcrypt';
import sql from 'mssql';
import { sqlConfig } from "@/app/_libs/sql_config";
import { type TSignInSchema, readUserSchema, signInSchema } from "@/app/_libs/zod_auth";
import { getErrorMessage } from '@/app/_libs/error_handler';
import { signJwtToken } from '@/app/_libs/jwt';
import { parsedEnv } from '@/app/_libs/zod_env';
import prisma from '@/prisma/prisma';

const schema = 'packing';
const table = 'user';

export async function POST(request: Request) {

    let body: TSignInSchema = await request.json();

    const parsedForm = signInSchema.safeParse({
        email: body.email,
        password: body.password,
    });

    if (!parsedForm.success) {
        return new Response(JSON.stringify({ error: parsedForm.error.message }), {status: 401})
    };

    try {
        
        let parsedResult;
        if (parsedEnv.DB_TYPE === 'PRISMA') {
            const result = await prisma.user.findFirst({
                where: {
                    email: parsedForm.data.email,
                },
            })
            parsedResult = readUserSchema.safeParse(result);
        }

        else {
            let pool = await sql.connect(sqlConfig);
            const result = await pool.request()
                            .input('schema', sql.VarChar, schema)
                            .input('table', sql.VarChar, table)
                            .input('email', sql.VarChar, parsedForm.data.email)
                            .query`SELECT user_uid, email, password, role, user_createdAt, user_updatedAt
                                    FROM "@schema"."@table"
                                    WHERE email = @email;
                            `;
            parsedResult = readUserSchema.safeParse(result.recordset);
        }
    
        if (!parsedResult.success) {
            return new Response(JSON.stringify({ error: parsedResult.error.message }), {status: 401});
        };

        if (parsedResult.data.password && (await bcrypt.compare(parsedForm.data.password, parsedResult.data.password))) {
            const {password, ...userWithoutPassword} = parsedResult.data;
            const jwtToken = signJwtToken(userWithoutPassword);
            const userWithToken = {
                ...userWithoutPassword,
                jwtToken,
            };

            // revalidatePath('/');
            return new Response(JSON.stringify(userWithToken), {status: 200})
        }
        else {
            return new Response(JSON.stringify({ error: "Invalid crendentials!" }), {status: 401});
        }
    } 
    catch (err) {
        return new Response(JSON.stringify({ error: getErrorMessage(err) }), {status: 401});
    }

};