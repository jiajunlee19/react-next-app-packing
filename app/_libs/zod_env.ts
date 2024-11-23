import { z } from 'zod';

export const envSchema = z.object({

    // PORT
    PORT: z.coerce.number().int().gte(1000).lte(9999),

    // Base url
    BASE_URL: z.string().min(1).url(),

    // DB_TYPE (PRISMA / RAW)
    DB_TYPE: z.enum(['PRISMA', 'RAW']),

    // Database connections
    DB_URL: z.string().min(1),
    DB_PRISMA_URL: z.string().min(1),
    DB_URL_NON_POOLING: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_HOST: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_DATABASE: z.string().min(1),

    // Next Auth
    NEXTAUTH_URL: z.string().min(1).url(),
    NEXTAUTH_SECRET: z.string().min(1),

    // LDAP
    LDAP_ORGANISATION: z.string().min(1),
    LDAP_DOMAIN: z.string().min(1),
    LDAP_BASE_DN: z.string().min(1),
    LDAP_URL: z.string().min(1).url(),

    // UUID namespace secret
    UUID5_NAMESPACE: z.string().min(1),
    UUID5_DELIMITER: z.string().min(1),
});

export const parsedEnv = envSchema.parse(process.env);