const consolContr = require('../controllers/ConsolCont.js');
const categContr = require('../controllers/CategCont.js');
const {gamesInDB, gamesFromAPI, gamesToDB, searchConsolIDInDB, searchCategIDInDB, createGameInDB, searchNameInDB} = require('../utils/funGames');
const { consolasInDB, categoriasInDB } = require('../utils/funcCons&Cat.js');
const { companyInDB } = require('../utils/funCompany.js');
const companyContr = require('./CompCont.js');



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
            return gamesInDB();

            //console.log(games)
        }else {
            //trae la informacion de la base de datos
            return gamesInDB();
        }
        

    } catch (error) {
        throw new Error('Error los juegos!!');
    }
}

const createGameDB = async(nombre, descripcion, img, categorias, consola) => {

    try{
        let consAux = await consolasInDB();
        let catAux = await categoriasInDB();
        let compAux = await companyInDB();

        if (consAux.length === 0 || catAux.length === 0 || compAux) {
            await Promise.all([consolContr(), categContr(), companyContr()]);
    
            // Vuelve a consultar la base de datos después de que se hayan ejecutado las funciones
            consAux = await consolasInDB();
            catAux = await categoriasInDB();
            compAux = await companyInDB();
        } 

        const ConsolDBID = await searchConsolIDInDB(consola);
        const CategDBID = await searchCategIDInDB(categorias);
        
        const GamesNameCreated = await searchNameInDB(nombre);
        //console.log(GamesNameCreated)

        //----- Falta agregar un verificador para las imagenes!!!!!

        // console.log(consAux);
        // console.log(catAux);
        // console.log(ConsolDBID);
        // console.log(CategDBID);
        //console.log(catAux);
        //let variables = await consAux;

        if(ConsolDBID.length > 0 && CategDBID.length > 0 && GamesNameCreated === false){
            const juego = await createGameInDB(nombre, descripcion, img, CategDBID, ConsolDBID);
            //console.log(juego)
            return juego;
        }

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
        }
}




module.exports = {gamesContr, createGameDB};