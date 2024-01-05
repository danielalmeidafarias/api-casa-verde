-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "cart" JSONB NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_id_key" ON "Pedido"("id");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
