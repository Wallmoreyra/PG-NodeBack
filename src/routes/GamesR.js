const { Router } = require('express');
const  {gamesHand, createGameHandler, gameBiIDHandler, deleteGameHandler, updateGameHandler}  = require('../handlers/GamesHand');
//const createGameHandler = require('../handlers/GamesHand');

const gamesR = Router();

// peticion de GET
gamesR.get('/', gamesHand);

// peticion de POST
gamesR.post('/', createGameHandler)

// peticion de GET por ID
gamesR.get('/idGames/:id', gameBiIDHandler);

// peticion de PUT
gamesR.put('/idGames/:id', updateGameHandler);

// peticion de DELETE
gamesR.delete('/idGames/:id', deleteGameHandler);



module.exports = gamesR;