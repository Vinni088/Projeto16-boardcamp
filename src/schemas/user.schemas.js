import joi from "joi"

export const insertClientSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.number().min(0).max(99999999999).required(),
    birthday: joi.date().required()
});

/*{
    name: 'João Alfredo',
    phone: '21998899222',
    cpf: '01234567890',
    birthday: '1992-10-25'
}*/