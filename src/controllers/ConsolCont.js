const {consolasFromAPI, consolasInDB, consolasToDB } = require('../utils/funcCons&Cat');


const consolContr = async() => {
    try {
        let ConsolAux = await consolasInDB();
        //console.log(ConsolAux)
        //Si la tabla no tiene datos los busca de la api
        if(ConsolAux.length === 0){
            const consolas = await consolasFromAPI();
            //console.log(consolas)
            await consolasToDB(consolas);
            return consolasInDB();

        }else {
            //trae la informacion de la base de datos
            return consolasInDB();
        }
        

    } catch (error) {
        throw new Error('Error al buscar las consolas!!!');
    }
} 

module.exports = consolContr;