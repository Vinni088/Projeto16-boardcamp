import { Router } from "express";
import { getClients, insertClient, updateClient, getClientsById } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js"
import { insertClientSchema } from "../schemas/user.schemas.js";

const userRouter = Router();

userRouter.get("/customers", getClients);
userRouter.get("/customers/:id", getClientsById);
userRouter.post("/customers", validateSchema(insertClientSchema), insertClient);
userRouter.put("/customers/:id", validateSchema(insertClientSchema), updateClient);

export default userRouter