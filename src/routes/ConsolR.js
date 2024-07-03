const { Router } = require('express');
const  consolHand  = require('../handlers/ConsolHand');

const consolR = Router();

// peticion de GET
consolR.get('/', consolHand);


module.exports = consolR;