const { Router } = require("express");
const gamesR = require('./GamesR');
const consolR = require('./ConsolR');
const categR = require("./CategR");
const compaR = require("./CompR");

const router = Router();

//rutas de Games
router.use('/games', gamesR);

//rutas de Consolas
router.use('/consol', consolR);

//rutas de Categorias
router.use('/categ', categR);

//rutas de Categorias
router.use('/company', compaR);


module.exports = router;