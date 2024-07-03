
const {Consol, Category} = require('../database');


const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../api/consolas.json');
const filePath2 = path.join(__dirname, '../../api/categorias.json');

//Funciones de consolas:

//Buscar las consolas en la base de datos
const consolasInDB = async () => {
    const allConsolDB = await Consol.findAll();
    //console.log(allConsolDB)
    return allConsolDB.map(item => item.nombre);
 }

// Leer el archivo JSON de la API
const consolasFromAPI = async () => {
    try {
      // Leer el archivo JSON de forma asíncrona
      const data = await fs.readFile(filePath, 'utf8');
      // Parsear el contenido del archivo JSON
      const consoles = JSON.parse(data);
      //console.log(consoles)
      return consoles.consolas;
    } catch (err) {
      console.error('Error al leer el archivo:', err);
      throw new Error('Error al leer el archivo JSON');
    }
  };

//Funcion para guardar las consolas en la base de datos!!!
const consolasToDB = async (array) => {
    for (const item of array) {
        try {
            // comprobar si los teams ya existen en la DB
            const consolaExist = await Consol.findOne({ where: { nombre: item.nombre }});

            if (!consolaExist) {
                // si no existe se crea
                const cons = await Consol.create({ nombre: item.nombre });
                console.log(`Consola creada: ${cons.nombre}`);
            } else {
                console.error(`La consola de nombre: ${item.nombre} ya existe en la base de datos!!!`);
            }
        } catch (error) {
            console.error(`Error al tratar de guardar los nombres`, error);
        }
    }
   
};

//Funciones para las Categorias

//Buscar las categorias en la base de datos
const categoriasInDB = async () => {
    const allCategDB = await Category.findAll();
    //console.log(allCategDB)
    return allCategDB.map(item => item.nombre);
};

// Leer el archivo JSON de la API
const categoriasFromAPI = async () => {
    try {
      // Leer el archivo JSON de forma asíncrona
      const data = await fs.readFile(filePath2, 'utf8');
      // Parsear el contenido del archivo JSON
      const categorias = JSON.parse(data);
      //console.log(consoles)
      return categorias.categorias;
    } catch (err) {
      console.error('Error al leer el archivo:', err);
      throw new Error('Error al leer el archivo JSON');
    }
  };

//Funcion para guardar las consolas en la base de datos!!!
const categoriasToDB = async (array) => {
    for (const item of array) {
        try {
            // comprobar si los teams ya existen en la DB
            const cateExist = await Category.findOne({ where: { nombre: item.nombre }});

            if (!cateExist) {
                // si no existe se crea
                const cat = await Category.create({ nombre: item.nombre });
                console.log(`Categoria creada: ${cat.nombre}`);
            } else {
                console.error(`La categoria de nombre: ${item.nombre} ya existe en la base de datos!!!`);
            }
        } catch (error) {
            console.error(`Error al tratar de guardar los nombres`, error);
        }
    }
   
};


module.exports = {consolasFromAPI, consolasInDB, consolasToDB, categoriasInDB, categoriasFromAPI, categoriasToDB}