import { db } from "../database/database.connection.js";
/* Get Clients */
export async function getClients(req, res) {
  try {
    const clientes = await db.query(`
        SELECT 
        id,
        name, 
        phone,
        cpf,
        TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
        FROM customers;
        `);
    res.send(clientes.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getClientsById(req, res) {
  let { id } = req.params;
  try {
    const clientes = await db.query(
      `
        SELECT 
        id,
        name, 
        phone,
        cpf,
        TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday
        FROM customers WHERE id = $1;
        `,
      [id]
    );
    if (clientes.rows.length === 0) return res.sendStatus(404);
    res.send(clientes.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

/* Insert Clients */
export async function insertClient(req, res) {
  /*{
        name: 'João Alfredo',
        phone: '21998899222',
        cpf: '01234567890',
		birthday: '1992-10-25'
    }*/
  const { name, phone, cpf, birthday } = req.body;

  try {
    let cpfExistente = await db.query(
      ` SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );
    if (cpfExistente.rows.length > 0)
      return res
        .status(409)
        .send(" Você não pode cadastrar um cpf já cadastrado");

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
  res.status(201).send("Cliente Cadastrado");
}
/* Update Clients */
export async function updateClient(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    let cpfExistente = await db.query(
      ` SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );
    if (cpfExistente.rows.length > 0) {
      return res
        .status(409)
        .send(" Você não pode alterar um cpf para um cpf já cadastrado");
    }

    await db.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`,
      [name, phone, cpf, birthday, id]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
  res.status(200).send("Cliente Atualizado");
}
