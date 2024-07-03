const consolContr = require('../controllers/ConsolCont.js');
const categContr = require('../controllers/CategCont.js');
const {gamesInDB, gamesFromAPI, gamesToDB} = require('../utils/funGames');



const gamesContr = async() => {
    try {
        let gamesAux = await gamesInDB(); 
        //console.log(gamesAux)
        //Si la tabla no tiene datos los busca de la api
        if(gamesAux.length === 0){
            await consolContr();
            await categContr();
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
        let gamesAux = await gamesInDB();

        if(gamesAux.length === 0){
            await consolContr();
            await categContr();



            return gamesInDB();

            //console.log(games)
        }else {
            //trae la informacion de la base de datos
            return ;
        }
        

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }



        const teamsDB = await searchTeamsInDB(teams);
        const nameAndSurname = await searchNameSurname(name, surname);
        //console.log(nameAndSurname)
        if(nameAndSurname === 'si') {
            throw new Error(`Ya existe el Conductor ${name} ${surname} en la DB o en la API`);
        }
        if(teamsDB.length < 2){
            throw new Error(`Necesita mas de un equipo!!!`);
        }
        const teamsID = await searchTeamsIDInDB(teamsDB);
        //console.log(teams);
        //console.log(teamsDB.length);
        //console.log(teamsID);
        const driverCreate = await createDriverInDB(name, surname, description, image, nationality, birthdate, teamsID);

        return driverCreate;
        //return `vamos a crear el driver con ${name} ${surname} ${description} ${image} ${nationality} ${teamsDB}`
    
    }



    
module.exports = {gamesContr, createGameDB};