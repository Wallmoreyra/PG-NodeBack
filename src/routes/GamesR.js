const { Router } = require('express');
const  {gamesHand, createGameHandler}  = require('../handlers/GamesHand');
//const createGameHandler = require('../handlers/GamesHand');

const gamesR = Router();

// peticion de GET
gamesR.get('/', gamesHand);

// peticion de POST
gamesR.post('/', createGameHandler)

// peticion de GET

// peticion de PUT

// peticion de DELETE


module.exports = gamesR;