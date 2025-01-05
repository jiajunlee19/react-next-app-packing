-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "template";

-- CreateEnum
CREATE TYPE "template"."Role" AS ENUM ('user', 'admin', 'boss');

-- CreateTable
CREATE TABLE "template"."user" (
    "user_uid" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "template"."Role" NOT NULL DEFAULT 'user',
    "user_created_dt" TIMESTAMP NOT NULL,
    "user_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_uid")
);

-- CreateTable
CREATE TABLE "template"."type" (
    "type_uid" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "type_created_dt" TIMESTAMP NOT NULL,
    "type_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("type_uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_uid_key" ON "template"."user"("user_uid");

-- CreateIndex
CREATE UNIQUE INDEX "type_type_uid_key" ON "template"."type"("type_uid");
