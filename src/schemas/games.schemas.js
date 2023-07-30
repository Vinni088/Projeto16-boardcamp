import joi from "joi"

export const newGameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required()
});

export const newRentalSchema = joi.object({
    customerId: joi.number().integer().min(1).required(),
    gameId: joi.number().integer().min(1).required(),
    daysRented: joi.number().integer().min(1).required(),
});

/*{
    name: 'Banco Imobiliário',
    image: 'http://www.imagem.com.br/banco_imobiliario.jpg',
    stockTotal: 3,
    pricePerDay: 1500
}*/

/*{
  customerId: 1,
  gameId: 1,
  daysRented: 3
}*/