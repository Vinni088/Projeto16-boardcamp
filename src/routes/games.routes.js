import { Router } from "express"
import { getGames, insertGames } from "../controllers/games.controller.js"
import { newGameSchema } from "../schemas/games.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.js"

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(newGameSchema) , insertGames);

export default gamesRouter