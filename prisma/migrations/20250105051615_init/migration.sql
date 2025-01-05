-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "packing";

-- CreateEnum
CREATE TYPE "packing"."Status" AS ENUM ('active', 'shipped');

-- CreateEnum
CREATE TYPE "packing"."Role" AS ENUM ('user', 'admin', 'boss');

-- CreateTable
CREATE TABLE "packing"."user" (
    "user_uid" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "packing"."Role" NOT NULL DEFAULT 'user',
    "user_created_dt" TIMESTAMP NOT NULL,
    "user_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_uid")
);

-- CreateTable
CREATE TABLE "packing"."box_type" (
    "box_type_uid" UUID NOT NULL,
    "box_part_number" VARCHAR(50) NOT NULL,
    "box_max_tray" INTEGER NOT NULL,
    "box_type_created_dt" TIMESTAMP NOT NULL,
    "box_type_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "box_type_pkey" PRIMARY KEY ("box_type_uid")
);

-- CreateTable
CREATE TABLE "packing"."tray_type" (
    "tray_type_uid" UUID NOT NULL,
    "tray_part_number" VARCHAR(50) NOT NULL,
    "tray_max_drive" INTEGER NOT NULL,
    "tray_type_created_dt" TIMESTAMP NOT NULL,
    "tray_type_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "tray_type_pkey" PRIMARY KEY ("tray_type_uid")
);

-- CreateTable
CREATE TABLE "packing"."shipdoc" (
    "shipdoc_uid" UUID NOT NULL,
    "shipdoc_number" VARCHAR(50) NOT NULL,
    "shipdoc_contact" VARCHAR(50) NOT NULL,
    "shipdoc_created_dt" TIMESTAMP NOT NULL,
    "shipdoc_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "shipdoc_pkey" PRIMARY KEY ("shipdoc_uid")
);

-- CreateTable
CREATE TABLE "packing"."box" (
    "box_uid" UUID NOT NULL,
    "box_type_uid" UUID NOT NULL,
    "shipdoc_uid" UUID NOT NULL,
    "box_status" "packing"."Status" NOT NULL DEFAULT 'active',
    "box_created_dt" TIMESTAMP NOT NULL,
    "box_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "box_pkey" PRIMARY KEY ("box_uid")
);

-- CreateTable
CREATE TABLE "packing"."tray" (
    "tray_uid" UUID NOT NULL,
    "box_uid" UUID NOT NULL,
    "tray_type_uid" UUID NOT NULL,
    "tray_created_dt" TIMESTAMP NOT NULL,
    "tray_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "tray_pkey" PRIMARY KEY ("tray_uid")
);

-- CreateTable
CREATE TABLE "packing"."lot" (
    "lot_uid" UUID NOT NULL,
    "tray_uid" UUID NOT NULL,
    "lot_id" VARCHAR(50) NOT NULL,
    "lot_qty" INTEGER NOT NULL,
    "lot_created_dt" TIMESTAMP NOT NULL,
    "lot_updated_dt" TIMESTAMP NOT NULL,

    CONSTRAINT "lot_pkey" PRIMARY KEY ("lot_uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_uid_key" ON "packing"."user"("user_uid");

-- CreateIndex
CREATE UNIQUE INDEX "box_type_box_type_uid_key" ON "packing"."box_type"("box_type_uid");

-- CreateIndex
CREATE UNIQUE INDEX "tray_type_tray_type_uid_key" ON "packing"."tray_type"("tray_type_uid");

-- CreateIndex
CREATE UNIQUE INDEX "shipdoc_shipdoc_uid_key" ON "packing"."shipdoc"("shipdoc_uid");

-- CreateIndex
CREATE UNIQUE INDEX "box_box_uid_key" ON "packing"."box"("box_uid");

-- CreateIndex
CREATE UNIQUE INDEX "tray_tray_uid_key" ON "packing"."tray"("tray_uid");

-- CreateIndex
CREATE UNIQUE INDEX "lot_lot_uid_key" ON "packing"."lot"("lot_uid");

-- AddForeignKey
ALTER TABLE "packing"."box" ADD CONSTRAINT "box_box_type_uid_fkey" FOREIGN KEY ("box_type_uid") REFERENCES "packing"."box_type"("box_type_uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "packing"."box" ADD CONSTRAINT "box_shipdoc_uid_fkey" FOREIGN KEY ("shipdoc_uid") REFERENCES "packing"."shipdoc"("shipdoc_uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "packing"."tray" ADD CONSTRAINT "tray_box_uid_fkey" FOREIGN KEY ("box_uid") REFERENCES "packing"."box"("box_uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "packing"."tray" ADD CONSTRAINT "tray_tray_type_uid_fkey" FOREIGN KEY ("tray_type_uid") REFERENCES "packing"."tray_type"("tray_type_uid") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "packing"."lot" ADD CONSTRAINT "lot_tray_uid_fkey" FOREIGN KEY ("tray_uid") REFERENCES "packing"."tray"("tray_uid") ON DELETE RESTRICT ON UPDATE RESTRICT;
