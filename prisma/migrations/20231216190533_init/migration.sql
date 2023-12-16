-- CreateTable
CREATE TABLE "NewsLetterEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetterEmail_id_key" ON "NewsLetterEmail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetterEmail_email_key" ON "NewsLetterEmail"("email");
