const { Router } = require('express');
const  categHand  = require('../handlers/CategHand');

const categR = Router();

// peticion de GET
categR.get('/', categHand);


module.exports = categR;