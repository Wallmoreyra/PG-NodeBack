const { Router } = require('express');
const  {gamesHand, createGameHandler, gameBiIDHandler, deleteGameHandler, updateGameHandler, renderFormHand, renderUpdateFormHand, renderAllGamesHand}  = require('../handlers/GamesHand');
const upload = require('../middleware/multer');


const gamesR = Router();

// peticion de GET
gamesR.get('/', gamesHand);

// peticion de POST
gamesR.post('/', upload.single('img'), createGameHandler)

// peticion de GET por ID
gamesR.get('/idGames/:id', gameBiIDHandler);

// peticion de PUT
gamesR.put('/idGames/:id', upload.single('img'), updateGameHandler);

// peticion de DELETE
gamesR.delete('/idGames/:id', deleteGameHandler);

//Rutas de la dash
gamesR.get('/add', renderFormHand)

gamesR.get('/update/:id', renderUpdateFormHand)

gamesR.get('/all-games', renderAllGamesHand)

module.exports = gamesR;