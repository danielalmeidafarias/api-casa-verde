/*
  Warnings:

  - You are about to drop the column `paymentIntent` on the `Pedido` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Pedido_paymentIntent_key";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "paymentIntent";
