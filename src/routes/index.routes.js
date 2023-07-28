import { Router } from "express";
import gamesRouter from "./games.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use(userRouter);
router.use(gamesRouter);

export default router;
