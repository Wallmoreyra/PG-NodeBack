const {gamesContr, createGameDB, getGameIDController, deleteGameController, updateGameController} = require('../controllers/GamesCont.js');
//const createGameDB = require('../controllers/GamesCont.js');


// Get all handdler
const gamesHand = async(req, res) => {
    try {
        const gamesAPI = await gamesContr();
        res.status(200).json(gamesAPI);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};


// Post handdler
const createGameHandler = async (req, res) => {
    const {nombre, descripcion, img, categorias, consola, desarrollador} = req.body;

    try {
        const response = await createGameDB(nombre, descripcion, img, categorias, consola, desarrollador);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

// Get by ID handdler
const gameBiIDHandler= async(req, res) => {

    const {id} = req.params;

    try {
        const response = await getGameIDController(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

// Delete handdler

const deleteGameHandler = async(req, res) => {

    const {id} = req.params;

    try {
        const response = await deleteGameController(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

// PUT handdler
const updateGameHandler = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const response = await updateGameController(id, data);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {gamesHand, createGameHandler, gameBiIDHandler, deleteGameHandler, updateGameHandler };