-- AlterTable
CREATE SEQUENCE cart_id_seq;
ALTER TABLE "Cart" ALTER COLUMN "id" SET DEFAULT nextval('cart_id_seq');
ALTER SEQUENCE cart_id_seq OWNED BY "Cart"."id";
