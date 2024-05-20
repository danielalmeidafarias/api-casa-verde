-- CreateTable
CREATE TABLE "Planta" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "onSale" BOOLEAN,
    "number" INTEGER NOT NULL DEFAULT 0,
    "tempNumber" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "NewsLetterEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "cart" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentIntent" TEXT,
    "paymentUrl" TEXT NOT NULL,
    "subTotal" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Planta_id_key" ON "Planta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Planta_name_key" ON "Planta"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetterEmail_id_key" ON "NewsLetterEmail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetterEmail_email_key" ON "NewsLetterEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_id_key" ON "Pedido"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_paymentIntent_key" ON "Pedido"("paymentIntent");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
