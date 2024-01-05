/*
  Warnings:

  - Added the required column `status` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "status" TEXT NOT NULL;
