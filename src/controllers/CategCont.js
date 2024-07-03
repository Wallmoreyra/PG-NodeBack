const {categoriasInDB, categoriasFromAPI, categoriasToDB } = require('../utils/funcCons&Cat');



const categContr = async() => {
    try {
        let CategAux = await categoriasInDB();
        //console.log(CategAux)
        //Si la tabla no tiene datos los busca de la api
        if(CategAux.length === 0){
            const categ = await categoriasFromAPI();
            await categoriasToDB(categ);
            return categoriasInDB();

            //console.log(categ)
        }else {
            //trae la informacion de la base de datos
            return categoriasInDB();
        }
        

    } catch (error) {
        throw new Error('Error al buscar las categorias!!!');
    }
} 

module.exports = categContr;