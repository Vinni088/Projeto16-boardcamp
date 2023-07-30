import { db } from "../database/database.connection.js"
/* Games */
export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`)
        res.send(games.rows)
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

/* Rentals */
export async function getRentals(req, res) {

    try {
        const rentals = await db.query(`
        SELECT rentals.id, rentals."customerId", rentals."gameId",
        TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate", rentals."daysRented", rentals."returnDate",
        rentals."originalPrice", rentals."delayFee" , customers.name AS "CustomerName", games.name AS "GameName" FROM Rentals
        JOIN customers ON customers.id = rentals."customerId"
        JOIN games ON games.id = rentals."gameId";
        `)
        let rentalSend = rentals.rows.map( obj => ({
            id: obj.id,
            customerId: obj.customerId,
            gameId: obj.gameId,
            rentDate: obj.rentDate,
            daysRented: obj.daysRented,
            returnDate: obj.returnDate,
            originalPrice: obj.originalPrice,
            delayFee: obj.delayFee,
            customer: {
                id: obj.customerId,
                name: obj.CustomerName
            },
            game: {
                id: obj.gameId,
                name: obj.GameName
            }
        }))


        res.send(rentalSend)
    } catch (err) {
        res.status(500).send(err.message)
    }

}
export async function insertRental(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    let string = `
    INSERT INTO rentals (
        "customerId", "gameId", "daysRented", "rentDate", "originalPrice"
    ) VALUES (
        1, 1, 3, '2023-07-29', 1500
    );
    `
    try {
        let game = await db.query(` SELECT * FROM games WHERE id = $1`, [gameId] )
        let customer = await db.query(` SELECT * FROM customers WHERE id = $1`, [customerId] )
        if (game.rows.length === 0 || customer.rows.length === 0) {
            return res.status(400).send("Algum dos ids inseridos não é válido :(")
        }
        res.send(game.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }
    
}