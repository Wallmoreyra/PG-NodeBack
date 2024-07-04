const {companyInDB, companyFromAPI, companyToDB } = require('../utils/funCompany');



const companyContr = async() => {
    try {
        let CompAux = await companyInDB();
        //console.log(CategAux)
        //Si la tabla no tiene datos los busca de la api
        if(CompAux.length === 0){
            const comp = await companyFromAPI();
            await companyToDB(comp);
            return companyInDB();

            //console.log(categ)
        }else {
            //trae la informacion de la base de datos
            return companyInDB();
        }
        

    } catch (error) {
        throw new Error('Error al buscar las companias!');
    }
} 

module.exports = companyContr;