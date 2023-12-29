import { JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
  email: string;
  name: string;
}
