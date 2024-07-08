const {gamesContr, createGameDB, getGameIDController, deleteGameController, updateGameController, renderGameForm, renderUpdateForm, renderAllGamesContr} = require('../controllers/GamesCont.js');
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
    //const {nombre, descripcion, img, categorias, consola, desarrollador} = req.body;
    console.log(req.body)
    const { nombre, descripcion, categorias, consolas, desarrollador } = req.body;
    const img = req.file.path; // URL de la imagen en Cloudinary

    try {
        const response = await createGameDB(nombre, descripcion, img, categorias, consolas, desarrollador);
        //Mensaje por Flash
        //req.flash('success_msg', 'Producto creado correctamente!')
                    
        res.redirect('/games/all-games');
        //res.status(200).json(response);
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
        console.log(response);
        res.redirect('/games/all-games');
       // res.status(200).json(response);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

// PUT handdler
const updateGameHandler = async (req, res) => {
    // console.log(req.body)
    // const data = { nombre, descripcion, categorias, consolas, desarrollador } = req.body;
    // const img = req.file.path; // URL de la imagen en Cloudinary
    // const { id } = req.params;
    // //const data = req.body;
    // //console.log(req.body)
    // try {
    //     const response = await updateGameController(id, data);
    //     console.log(response);
    //     res.redirect('/games/all-games');
    //     //res.status(200).json(response);
    // } catch (error) {
    //     res.status(400).json({ error: error.message });
    // }
    console.log(req.body);
    const { nombre, descripcion, categorias, consolas, desarrollador } = req.body;
    const { id } = req.params;

    let data = { nombre, descripcion, categorias, consolas, desarrollador };

    if (req.file) {
        data.img = req.file.path; // URL de la imagen en Cloudinary
    }

    try {
        const response = await updateGameController(id, data);
        console.log(response);
        res.redirect('/games/all-games');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// handbler Dahsboard:

const renderFormHand = async (req, res) => {
    
    try {
        
        //res.status(200).json(response);
        await renderGameForm(req, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const renderUpdateFormHand = async (req, res) => {
    
    try {
        await renderUpdateForm(req, res);
        //res.render('games/new-game')
        //res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const renderAllGamesHand = async (req, res) => {
    try {
        
        await renderAllGamesContr(req, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {gamesHand, createGameHandler, gameBiIDHandler, deleteGameHandler, updateGameHandler, renderFormHand, renderUpdateFormHand, renderAllGamesHand };