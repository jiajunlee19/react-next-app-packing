-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "card-game";

-- CreateEnum
CREATE TYPE "card-game"."Role" AS ENUM ('user', 'admin', 'boss');

-- CreateTable
CREATE TABLE "card-game"."user" (
    "user_uid" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "card-game"."Role" NOT NULL DEFAULT 'user',
    "user_created_dt" TIMESTAMP NOT NULL,
    "user_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_uid_key" ON "card-game"."user"("user_uid");
