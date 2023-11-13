import { envSchema } from "@/app/_libs/zod_env";

const parsedEnv = envSchema.parse(process.env);

export const sqlConfig = {
    user: parsedEnv.DB_USER,
    password: parsedEnv.DB_PWD,
    database: parsedEnv.DB_NAME,
    server: parsedEnv.DB_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }