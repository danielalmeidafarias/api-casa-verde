import { Request, Response, Router } from "express";
import isAdmin from "../../middlewares/isAdmin";
import plantas from "./plantas";
import newsLetter from "./newsletter";

const admin = Router()
admin.use(isAdmin)

admin.use(plantas)
admin.use(newsLetter)

export default admin