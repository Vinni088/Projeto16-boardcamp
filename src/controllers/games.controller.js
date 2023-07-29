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
    /*{
        name: 'Banco Imobiliário',
        image: 'http://www.imagem.com.br/banco_imobiliario.jpg',
        stockTotal: 3,
        pricePerDay: 1500
    }*/
    const {name, image, stockTotal, pricePerDay} = req.body;

    try {
        let jogoExistente = await db.query(` SELECT * FROM games WHERE name = $1`, [name]);
        if(jogoExistente.rows.length > 0) return (res.status(409).send(" Você não pode ser um nome de jogo já existente"));
        
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
        [name, image, stockTotal, pricePerDay]);
    } catch (err) {
        res.status(500).send(err.message)
    }


    res.sendStatus(201);
    /*res.send(`${name}, ${image}, ${stockTotal}, ${pricePerDay}`)*/
}