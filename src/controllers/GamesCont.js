const consolContr = require('../controllers/ConsolCont.js');
const categContr = require('../controllers/CategCont.js');
const {gamesInDB, gamesFromAPI, gamesToDB, searchConsolIDInDB, searchCategIDInDB, createGameInDB, searchNameInDB, searchCompIDInDB, getGameByID, deleteGameByID, updateGameByID} = require('../utils/funGames');
const { consolasInDB, categoriasInDB } = require('../utils/funcCons&Cat.js');
const { companyInDB } = require('../utils/funCompany.js');
const companyContr = require('./CompCont.js');



// Get all Controller
const gamesContr = async() => {
    try {
        let gamesAux = await gamesInDB(); 
        //console.log(gamesAux)
        //Si la tabla no tiene datos los busca de la api
        if(gamesAux.length === 0){
            await consolContr();
            await categContr();
            await companyContr();
            const games = await gamesFromAPI();
            await gamesToDB(games);
            //console.log(games)
            return gamesInDB();

        }else {
            //trae la informacion de la base de datos
            return gamesInDB();
        }
        

    } catch (error) {
        throw new Error('Error los juegos!!');
    }
}


// POST Game Controller
const createGameDB = async(nombre, descripcion, img, categorias, consola, desarrollador) => {

    try{
        let consAux = await consolasInDB();
        let catAux = await categoriasInDB();
        let compAux = await companyInDB();

        if (consAux.length === 0 || catAux.length === 0 || compAux.length === 0) {
            await Promise.all([consolContr(), categContr(), companyContr()]);
    
            // Vuelve a consultar la base de datos después de que se hayan ejecutado las funciones
            consAux = await consolasInDB();
            catAux = await categoriasInDB();
            compAux = await companyInDB();
        } 
        //console.log(desarrollador)

        const ConsolDBID = await searchConsolIDInDB(consola);
        const CategDBID = await searchCategIDInDB(categorias);
        const CompDBID = await searchCompIDInDB(desarrollador);
        
        const GamesNameCreated = await searchNameInDB(nombre);
        //console.log(CompDBID)

        //----- Falta agregar un verificador para las imagenes!!!!!

        // Verificación de errores condicionales
        if (GamesNameCreated) {
            throw new Error(`El nombre del juego '${nombre}' ya existe en la base de datos.`);
        }

        if (ConsolDBID.length === 0) {
            throw new Error(`No se encontraron consolas con los nombres proporcionados.`);
        }

        if (CategDBID.length === 0) {
            throw new Error(`No se encontraron categorías con los nombres proporcionados.`);
        }

        if (CompDBID === null || CompDBID === '') {
            throw new Error(`La categoria de desarrolador no puede estar vacia`);
        }

        // if (CategDBID.length > 1) {
        //     throw new Error(`Se encontraron más de una categoría con los nombres proporcionados. Debe haber una única categoría.`);
        // }

        // console.log(consAux);
        // console.log(catAux);
        // console.log(ConsolDBID);
        // console.log(CategDBID);
        //console.log(catAux);
        //let variables = await consAux;

        if(ConsolDBID.length > 0 && CategDBID.length > 0 && GamesNameCreated === false){
            const juego = await createGameInDB(nombre, descripcion, img, CategDBID, ConsolDBID, CompDBID);
            //console.log(juego)
            return juego;
        } else {

        }

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
        }
}

// Get By ID Controller
const getGameIDController = async (id) => {
    try{
        const game = await getGameByID(id)
        console.log(id)
        return game;

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};

// Delete Controller

const deleteGameController = async (id) => {
    try{
        const game = await deleteGameByID(id)
        //console.log(id)
        return `El juego ${game.nombre} a sido borrado de la base de datos`;

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};


// PUT Controller
const updateGameController = async (id, data) => {
    try {
        const game = await updateGameByID(id, data);
        return game;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};




module.exports = {gamesContr, createGameDB, getGameIDController, deleteGameController, updateGameController};