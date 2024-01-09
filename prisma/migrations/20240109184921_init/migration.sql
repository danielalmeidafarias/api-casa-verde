/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntent]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "paymentIntent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_paymentIntent_key" ON "Pedido"("paymentIntent");
