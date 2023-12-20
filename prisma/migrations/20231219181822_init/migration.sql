/*
  Warnings:

  - You are about to drop the column `cartId` on the `Planta` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Planta` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "Planta" DROP CONSTRAINT "Planta_cartId_fkey";

-- AlterTable
ALTER TABLE "Planta" DROP COLUMN "cartId",
DROP COLUMN "number";

-- DropTable
DROP TABLE "Cart";
