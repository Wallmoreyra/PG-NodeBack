const { Router } = require('express');
const  companyHand  = require('../handlers/CompHand');

const compaR = Router();

// peticion de GET
compaR.get('/', companyHand);


module.exports = compaR;