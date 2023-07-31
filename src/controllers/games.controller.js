import { db } from "../database/database.connection.js";
/* Games */
export async function getGames(req, res) {
  try {
    const games = await db.query(`SELECT * FROM games;`);
    res.send(games.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function insertGames(req, res) {
  /*{
        name: 'Banco Imobiliário',
        image: 'http://www.imagem.com.br/banco_imobiliario.jpg',
        stockTotal: 3,
        pricePerDay: 1500
    }*/
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    let jogoExistente = await db.query(` SELECT * FROM games WHERE name = $1`, [
      name,
    ]);
    if (jogoExistente.rows.length > 0)
      return res
        .status(409)
        .send(" Você não pode ser um nome de jogo já existente");

    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
      [name, image, stockTotal, pricePerDay]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }

  res.sendStatus(201);
  /*res.send(`${name}, ${image}, ${stockTotal}, ${pricePerDay}`)*/
}

/* Rentals */

function gerardata() {
  let datajs = new Date();
  let dia = datajs.getDate();
  let month = datajs.getMonth() + 1;
  if (month < 10) {
    month = String(month);
    month = "0" + month;
  }
  let ano = datajs.getFullYear();
  let data = `${ano}-${month}-${dia}`;
  return data;
}

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
        SELECT rentals.id, rentals."customerId", rentals."gameId",
        TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate", rentals."daysRented", TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
        rentals."originalPrice", rentals."delayFee" , customers.name AS "CustomerName", games.name AS "GameName" FROM Rentals
        JOIN customers ON customers.id = rentals."customerId"
        JOIN games ON games.id = rentals."gameId";
        `);
    let rentalSend = rentals.rows.map((obj) => ({
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
        name: obj.CustomerName,
      },
      game: {
        id: obj.gameId,
        name: obj.GameName,
      },
    }));

    res.send(rentalSend);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function insertRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  let rentDate = gerardata();

  let string = `
    INSERT INTO rentals (
        "customerId", "gameId", "daysRented", "rentDate", "originalPrice"
    ) VALUES (
        $1, $2, $3, $4, $5
    );
    `;
  try {
    let game = await db.query(` SELECT * FROM games WHERE id = $1`, [gameId]);
    let customer = await db.query(` SELECT * FROM customers WHERE id = $1`, [
      customerId,
    ]);
    let rentalsById = await db.query(
      ` SELECT * FROM rentals WHERE "gameId" = $1`,
      [gameId]
    );
    if (game.rows.length === 0 || customer.rows.length === 0) {
      return res.status(400).send("Algum dos ids inseridos não é válido :(");
    }
    if (game.rows[0].stockTotal <= rentalsById.rows.length) {
      return res.status(400).send("Não existem jogos desse tipo disponiveis");
    }

    let originalPrice = game.rows[0].pricePerDay * daysRented;

    await db.query(string, [
      customerId,
      gameId,
      daysRented,
      rentDate,
      originalPrice,
    ]);

    res.status(201).send("Aluguel inserido");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function finishRental(req, res) {
  const { id } = req.params;

  try {
    let rentalsById = await db.query(
      ` SELECT *, TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate" FROM rentals WHERE id = $1`,
      [id]
    );
    if (rentalsById.rows.length === 0) {
      return res.sendStatus(404);
    }
    if (rentalsById.rows[0].returnDate !== null) {
      return res.sendStatus(400);
    }

    let game = await db.query(` SELECT * FROM games WHERE id = $1`, [
      rentalsById.rows[0].gameId,
    ]);

    let delayFee = null;
    let returnDate = gerardata();
    let dataAtual = new Date(gerardata());
    let dataAluguel = new Date(rentalsById.rows[0].rentDate);
    let diferença =
      (dataAtual.getTime() - dataAluguel.getTime()) / (1000 * 60 * 60 * 24);
    if (diferença > rentalsById.rows[0].daysRented) {
      delayFee =
        (diferença - rentalsById.rows[0].daysRented) * game.rows[0].pricePerDay;
    }
    await db.query(
      `
        UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3;
        `,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    let rental = await db.query(
      ` 
        SELECT *, TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate", 
        TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate"
        FROM rentals WHERE id = $1`,
      [id]
    );
    if (rental.rows.length === 0) {
      return res.status(404).send("O id selecionado não existe :(");
    }
    if (rental.rows[0].returnDate === null) {
      return res
        .status(400)
        .send("O aluguel selecionado ainda não foi finalizado");
    }
    await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    res.status(200).send("Aluguel Deletado");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
