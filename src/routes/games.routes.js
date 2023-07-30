import { Router } from "express"
import { getGames, insertGames, getRentals, insertRental } from "../controllers/games.controller.js"
import { newGameSchema, newRentalSchema } from "../schemas/games.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.js"

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(newGameSchema) , insertGames);
gamesRouter.get("/rentals", getRentals);
gamesRouter.post("/rentals", validateSchema(newRentalSchema), insertRental);

export default gamesRouter