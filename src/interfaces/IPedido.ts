import { JsonValue } from "@prisma/client/runtime/library";
import { TCart } from "./ICart";
import { IUser } from "./IUser";

export interface IPedido {
  id: string;
  cart: JsonValue;
  status: string;
  userId: string;
  date: Date;
  subTotal: number;
  paymentUrl: string;
  paymentIntent?: string;
}
