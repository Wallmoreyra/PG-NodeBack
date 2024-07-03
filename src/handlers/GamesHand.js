const {gamesContr, createGameDB} = require('../controllers/GamesCont.js');
//const createGameDB = require('../controllers/GamesCont.js');

const gamesHand = async(req, res) => {
    try {
        const gamesAPI = await gamesContr();
        res.status(200).json(gamesAPI);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};



const createGameHandler = async (req, res) => {
    const {nombre, descripcion, img, categorias, consola} = req.body;

    try {
        const response = await createGameDB(nombre, descripcion, img, categorias, consola);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};


module.exports = {gamesHand, createGameHandler };