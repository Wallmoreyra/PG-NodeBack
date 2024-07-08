

const { Op } = require('sequelize');
const {Games, Category, Consol, Company} = require('../database');


const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../../api/games.json');

//Funciones de consolas:

//Buscar las consolas en la base de datos
const gamesInDB = async () => {

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
                },
                Company  // Incluir la relación con la compañía
            ], order: [['createdAt', 'DESC']]
        });

        //console.log(allGamesDB)

        return allGamesDB.map(game => ({
            id: game.id,
            nombre: game.nombre,
            descripcion: game.descripcion,
            img: game.img,
            
            categorias: game.categories ? game.categories.map(category => category.nombre) : [], // Asumiendo que el atributo es 'nombre'
            consola: game.consols.map(consol => consol.nombre), // Asumiendo que el atributo es 'nombre'
            desarrollador: game.company.nombre
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

            //console.log(array)
            
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

                //Buscamos la companya que tiene relacion
                const company = await Company.findOne({ where: { nombre: item.desarrollador } });
                if (!company) {
                    throw new Error(`La compañía ${item.desarrollador} no existe en la base de datos.`);
                }
                // Asociar el juego a la compañía
                await juego.setCompany(company);

                //console.log(company)
                
                //console.log(`Juego creado: ${juego.nombre}`);

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

// Funciones para encontrar las id de las categorias y consolas
const searchConsolIDInDB = async (array) => {
    
    try {
        //console.log(array);

        // Obtener todas las consolas de la base de datos
        const allConsols = await Consol.findAll();

        // Filtrar las consolas que coincidan ignorando mayúsculas y minúsculas
        const consIDS = allConsols.filter(consol =>
            array.some(name => consol.nombre.toLowerCase() === name.toLowerCase())
        ).map(consol => consol.id);

        //console.log(consIDS);
        return consIDS;
    } catch (error) {
        console.error('Error al buscar las IDs de las consolas:', error);
        throw new Error('Error al buscar las IDs de las consolas');
    }
}

const searchCategIDInDB = async (array) => {
    try {
        //console.log(array);

        // Obtener todas las categorias de la base de datos
        const allCateg = await Category.findAll();

        // Filtrar las categorias que coincidan ignorando mayúsculas y minúsculas
        const cateIDS = allCateg.filter(categ =>
            array.some(name => categ.nombre.toLowerCase() === name.toLowerCase())
        ).map(categ => categ.id);

        //console.log(cateIDS);
        return cateIDS;
    } catch (error) {
        console.error('Error al buscar las IDs de las categorias:', error);
        throw new Error('Error al buscar las IDs de las categorias');
    }
}

// Funcion POST para crear el juego en la base de datos con sus relaciones:
const createGameInDB = async (nombre, descripcion, img, CategDBID, ConsolDBID, CompDBID) => {

    try {
        
        const game = await Games.create({
            nombre,
            descripcion,
            img
        });
        
        game.addCategory(CategDBID);
        game.addConsol(ConsolDBID);
        game.setCompany(CompDBID);

      
        const allConsols = await Consol.findAll();
        const allCategory = await Category.findAll();

        const nombresConsolas = allConsols.filter(consol =>
            ConsolDBID.some(id => consol.id === id)
        ).map(consol => consol.nombre);

        const nombresCategorias = allCategory.filter(cate =>
            CategDBID.some(id => cate.id === id)
        ).map(cate => cate.nombre);
        


        // Recuperar el juego junto con sus relaciones
        const gameWithAssociations = await Games.findOne({
            where: { id: game.id },
            include: [
                { model: Company }
            ]
        });

        //console.log(gameWithAssociations)

        return {
            id: game.id,
            nombre: game.nombre,
            descripcion: game.descripcion,
            img: game.img,
            categorias: nombresCategorias ? nombresCategorias : [],
            consola: nombresConsolas ? nombresConsolas : [],
            desarrollador: gameWithAssociations.company.nombre
        };
        
    } catch (error) {
        throw new Error('Error al crear el Juego en la DB: ' + error.message);
    }
}

const searchNameInDB = async(nombre) => {
    try {
        const gameExist = await Games.findOne({ where: { nombre: nombre }});
        //console.log(gameExist);
        return gameExist ? true : false;
    } catch (error) {
        console.error('Error al buscar el juego en la base de datos:', error);
        throw new Error('Error al buscar el juego en la base de datos');
    }
}

// Funcion que busca la companya por el id
const searchCompIDInDB = async(nombre) => {
    try {
        // Obtener todas las compañías de la base de datos
        const allCompanies = await Company.findAll();
        
        // Filtrar las compañías que coincidan ignorando mayúsculas y minúsculas
        const matchingCompany = allCompanies.filter(company =>
            company.nombre.toLowerCase() === nombre.toLowerCase()
        )[0];

        if (matchingCompany) {
            //console.log(matchingCompany.id);
            return matchingCompany.id;
        } else {
            console.log(`Compañía con nombre ${nombre} no encontrada`);
            return null;
        }
    } catch (error) {
        console.error('Error al buscar la compania en la base de datos:', error);
        throw new Error('Error al buscar la compania en la base de datos');
    }
}

// Funcion que busca el juego por ID

const getGameByID = async (id) => {

    const game = await Games.findByPk(id, {
        include: [
            {
                model: Category,
                through: { attributes: [] } // Excluye los atributos de la tabla intermedia
            },
            {
                model: Consol,
                through: { attributes: [] } // Si también deseas incluir las consolas
            },
            Company  // Incluir la relación con la compañía
        ]
    });

    if (game === '' || game === null) {
        throw new Error('No se encontro el juego con esa ID en la DB!!!');
    }

    return auxGame  = ({
        id: game.id,
        nombre: game.nombre,
        descripcion: game.descripcion,
        img: game.img,
        categorias: game.categories ? game.categories.map(category => category.nombre) : [], // Asumiendo que el atributo es 'nombre'
        consola: game.consols.map(consol => consol.nombre), // Asumiendo que el atributo es 'nombre'
        desarrollador: game.company.nombre
    });

    //console.log(auxGame)

}

const deleteGameByID = async (id) => {

    console.log(id)

    const game = await Games.findByPk(id, {
        include: [
            {
                model: Category,
                through: { attributes: [] } // Excluye los atributos de la tabla intermedia
            },
            {
                model: Consol,
                through: { attributes: [] } // Si también deseas incluir las consolas
            },
            Company  // Incluir la relación con la compañía
        ]
    });

    if (game === '' || game === null) {
        throw new Error('No se encontro el juego con esa ID en la DB!!!');
    }

    const auxGame = {
        id: game.id,
        nombre: game.nombre,
        descripcion: game.descripcion,
        img: game.img,
        categorias: game.categories ? game.categories.map(category => category.nombre) : [], // Asumiendo que el atributo es 'nombre'
        consola: game.consols.map(consol => consol.nombre), // Asumiendo que el atributo es 'nombre'
        desarrollador: game.company.nombre
    };

    // Eliminar el juego
    await game.destroy();


    //console.log(auxGame)

    return auxGame;

}

// Funcion del metodo PUT update
const updateGameByID = async (id, data) => {
    const { nombre, descripcion, img, categorias, consolas, desarrollador } = data;

    try {
        const gameInstance = await Games.findByPk(id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Consol, through: { attributes: [] } },
                Company
            ]
        });

        if (!gameInstance) {
            throw new Error('No se encontró el juego con esa ID en la DB!!!');
        }

        // Verificar si el nuevo nombre ya existe en otro juego
        if (nombre && nombre.toLowerCase() !== gameInstance.nombre.toLowerCase()) {
            const existingGame = await Games.findOne({ 
                where: { 
                    nombre: { [Op.iLike]: nombre } 
                } 
            });
            if (existingGame) {
                throw new Error('Ya existe un juego con ese nombre en la DB!!!');
            }
        }

        // Actualizar la información del juego
        gameInstance.nombre = nombre || gameInstance.nombre;
        gameInstance.descripcion = descripcion || gameInstance.descripcion;
        gameInstance.img = img || gameInstance.img;

        await gameInstance.save();

        // Actualizar categorías
        if (categorias) {
            const newCategories = await Category.findAll({ 
                where: { 
                    [Op.or]: categorias.map(nombre => ({ nombre: { [Op.iLike]: nombre } }))
                } 
            });
            await gameInstance.setCategories(newCategories);
        }

        // Actualizar consolas
        if (consolas) {
            const newConsoles = await Consol.findAll({ 
                where: { 
                    [Op.or]: consolas.map(nombre => ({ nombre: { [Op.iLike]: nombre } }))
                } 
            });
            await gameInstance.setConsols(newConsoles);
        }

        // Actualizar compañía
        if (desarrollador) {
            const newCompany = await Company.findOne({ 
                where: { 
                    nombre: { [Op.iLike]: desarrollador } 
                } 
            });
            if (newCompany) {
                await gameInstance.setCompany(newCompany);
            }
        }

        return getGameByID(id); // Usar la función que formatea el juego

    } catch (error) {
        throw new Error('Error al actualizar el Juego en la DB: ' + error.message);
    }
};



module.exports = {gamesInDB, gamesFromAPI, gamesToDB, searchConsolIDInDB, searchCategIDInDB, createGameInDB, searchNameInDB, searchCompIDInDB, getGameByID, deleteGameByID, updateGameByID};