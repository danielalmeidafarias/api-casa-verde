-- CreateTable
CREATE TABLE "Planta" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "onSale" BOOLEAN
);

-- CreateIndex
CREATE UNIQUE INDEX "Planta_id_key" ON "Planta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Planta_name_key" ON "Planta"("name");
