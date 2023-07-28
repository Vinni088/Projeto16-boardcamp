import { db } from "../database/database.connection.js"

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    console.log(token);

    if (!token) return res.sendStatus(401)

    try {
        const session = await db.collection("session").findOne({ token })
        if (!session) return res.sendStatus(401)

        res.locals.session = session;

        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}