import { Router } from "express"
import { getClients, insertClient, updateClient } from "../controllers/user.controller.js"

const userRouter = Router();

userRouter.get("/customers", getClients);
userRouter.post("/customers", insertClient);
userRouter.put("/customers", updateClient);

export default userRouter