import { z } from 'zod';
// import { v5 as uuidv5 } from 'uuid';

export const envSchema = z.object({

    // Mode (DEV will use dummy database, PROD will use prod database)
    MODE: z.enum(['DEV', 'PROD']),

    // DB_TYPE (PRISMA / RAW)
    DB_TYPE: z.enum(['PRISMA', 'RAW']),

    // Base url
    BASE_URL: z.string().min(1).url(),

    // POSTGRESS connections
    POSTGRES_URL: z.string().min(1).startsWith('postgres://'),
    POSTGRES_PRISMA_URL: z.string().min(1).startsWith('postgres://'),
    POSTGRES_URL_NON_POOLING: z.string().min(1).startsWith('postgres://'),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),

    // Database connection
    DB_SERVER: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PWD: z.string().min(1),

    // GitHub OAuth
    GITHUB_ID: z.string().min(1),
    GITHUB_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1).url(),
    NEXTAUTH_SECRET: z.string().min(1),

    // UUID namespace secret
    UUID5_NAMESPACE: z.string().min(1),
    UUID5_DELIMITER: z.string().min(1),
});

export const parsedEnv = envSchema.parse(process.env);
// export const UUID5_SECRET = uuidv5(parsedEnv.UUID5_NAMESPACE, uuidv5.DNS);