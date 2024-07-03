
const {Games, Category, Consol} = require('../database');


const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../api/games.json');

//Funciones de consolas:

//Buscar las consolas en la base de datos
const gamesInDB = async () => {
    // const allGamesDB = await games.findAll();
    // console.log(allGamesDB)
    // //return allGamesDB.map(item => item.nombre);
    // return allGamesDB;
    try {
        const allGamesDB = await Games.findAll({
            include: [
                {
                    model: Category,
                    through: { attributes: [] } // Excluye los atributos de la tabla intermedia
                },
                {
                    model: Consol,
                    through: { attributes: [] } // Si también deseas incluir las consolas
                }
            ], order: [['createdAt', 'DESC']]
        });

        //console.log(allGamesDB)

        return allGamesDB.map(game => ({
            id: game.id,
            nombre: game.nombre,
            descripcion: game.descripcion,
            img: game.img,
            
            categorias: game.categories ? game.categories.map(category => category.nombre) : [], // Asumiendo que el atributo es 'nombre'
            consola: game.consols.map(consol => consol.nombre) // Asumiendo que el atributo es 'nombre'
        }));
    } catch (error) {
        console.error('Error al obtener los juegos de la base de datos:', error);
        throw new Error('Error al obtener los juegos de la base de datos');
    }
 }

// Leer el archivo JSON de la API
const gamesFromAPI = async () => {
    try {
      // Leer el archivo JSON de forma asíncrona
      const data = await fs.readFile(filePath, 'utf8');
      // Parsear el contenido del archivo JSON
      const games = JSON.parse(data);
      //console.log(games)
      return games.games;
    } catch (err) {
      console.error('Error al leer el archivo:', err);
      throw new Error('Error al leer el archivo JSON');
    }
  };

//Funcion para guardar las consolas en la base de datos!!!
const gamesToDB = async (array) => {
    for (const item of array) {
        try {
            // comprobar si los teams ya existen en la DB
            const gameExist = await Games.findOne({ where: { nombre: item.nombre }});

            if (!gameExist) {
                // si no existe se crea
                //const cons = await Games.create({ nombre: item.nombre });
                //console.log({ nombre: item.nombre, descripcion: item.desc, img: item.img, categoria: item.categoria, consola: item.consola})
                const juego = await Games.create({
                    nombre: item.nombre,
                    descripcion: item.desc,
                    img: item.img
                });
                const categories = await getOrCreateCategories(item.categoria);
                await juego.addCategory(categories);

                const consoles = await getOrCreateConsolas(item.consola);
                await juego.addConsol(consoles);
                
                console.log(`Juego creado: ${juego.nombre}`);

                //console.log(juego)
                //return juego;
            } else {
                console.error(`El juego de nombre: ${item.nombre} ya existe en la base de datos!!!`);
            }
        } catch (error) {
            console.error(`Error al tratar de guardar los nombres`, error);
        }
    }
   
};

// Funcion para verificar si las categorias o las consolas existen:

const getOrCreateCategories = async (categories) => {
    const categoryInstances = [];
    for (const categoryName of categories) {
        let category = await Category.findOne({ where: { nombre: categoryName } });
        if (!category) {
            category = await Category.create({ nombre: categoryName });
        }
        categoryInstances.push(category);
    }
    return categoryInstances;
};

const getOrCreateConsolas = async (console) => {
    const consoleInstances = [];
    for (const consoleName of console) {
        let consol = await Consol.findOne({ where: {nombre: consoleName}});
        if (!consol) {
            consol = await Consol.create({ nombre: consoleName});
        } 
        consoleInstances.push(consol);
    }
    return consoleInstances;
};




module.exports = {gamesInDB, gamesFromAPI, gamesToDB}