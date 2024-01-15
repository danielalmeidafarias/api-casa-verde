import { Request, Response, Router } from "express";
import isAdmin from "../../middlewares/isAdmin";
import plantas from "./plantas";
import newsLetter from "./newsletter";
import users from "./users";

const admin = Router();
admin.use(isAdmin);

admin.use(plantas);
admin.use(newsLetter);
admin.use(users);

export default admin;
