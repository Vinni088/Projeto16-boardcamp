import { db } from "../database/database.connection.js"

export async function getClients(req, res) {
    try {
        const clientes = await db.query(`SELECT * FROM customers;`)
        res.send(clientes.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function insertClient(req, res) {
    res.send("Adicionar Cliente")
}

export async function updateClient(req, res) {
    res.send("Atualizar Cliente")
}