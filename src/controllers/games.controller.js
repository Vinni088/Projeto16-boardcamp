import { db } from "../database/database.connection.js"

export async function getGames(req, res) {
    try {
        const receitas = await db.query(`SELECT * FROM games;`)
        res.send(receitas.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function insertGames(req, res) {
    res.send("Adicionar Jogo")
}