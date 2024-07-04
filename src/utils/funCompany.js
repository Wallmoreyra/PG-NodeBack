
const {Company} = require('../database');

const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../api/companys.json');


//Buscar las companias en la base de datos
const companyInDB = async () => {
    const allCompanyDB = await Company.findAll();
    //console.log(allCategDB)
    return allCompanyDB.map(item => item.nombre);
};

// Leer el archivo JSON de la API
const companyFromAPI = async () => {
    try {
      // Leer el archivo JSON de forma asíncrona
      const data = await fs.readFile(filePath, 'utf8');
      // Parsear el contenido del archivo JSON
      const company = JSON.parse(data);
      //console.log(consoles)
      return company.desarrolladores;
    } catch (err) {
      console.error('Error al leer el archivo:', err);
      throw new Error('Error al leer el archivo JSON');
    }
  };

//Funcion para guardar las consolas en la base de datos!!!
const companyToDB = async (array) => {
    for (const item of array) {
        try {
            // comprobar si los teams ya existen en la DB
            const compExist = await Company.findOne({ where: { nombre: item.nombre }});

            if (!compExist) {
                // si no existe se crea
                const comp = await Company.create({ nombre: item.nombre });
                console.log(`Compania creada: ${comp.nombre}`);
            } else {
                console.error(`La compania de nombre: ${item.nombre} ya existe en la base de datos!!!`);
            }
        } catch (error) {
            console.error(`Error al tratar de guardar los nombres`, error);
        }
    }
   
};


module.exports = {companyInDB, companyFromAPI, companyToDB}