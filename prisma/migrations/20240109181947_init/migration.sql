/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntent]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntent` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "paymentIntent" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_paymentIntent_key" ON "Pedido"("paymentIntent");
