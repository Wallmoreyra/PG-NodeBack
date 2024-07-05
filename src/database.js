// const {Pool} = require('pg');


// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DBNAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,

//   });
  
//   pool.connect((err, client, release) => {
//     if (err) {
//         return console.error('Error al conectarse a la base de datos:', err.stack);
//     }
//     console.log('Conectado a la base de datos PostgreSQL.');
//     release();
//   });

//   // Función para obtener datos de la tabla de prueba
//   async function queryGamesDatabase() {
//     try {
//       const client = await pool.connect();
//       const query = `
//         SELECT * FROM employees;
//       `;
//       const result = await client.query(query);
//       console.log('Resultados de la consulta:');
//       console.log(result.rows);
//       client.release();
//     } catch (error) {
//       console.error('Error al ejecutar consulta:', error);
//     }
//   }
  
//   // Llamar a la función para ejecutar la consulta en 'games'
//   queryGamesDatabase();

//   module.exports = pool;


  //--------------------------------------------

require('dotenv').config();

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_DBNAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DBNAME}`, {
  logging: false, 
  native: false, 
});

// Leer todos los archivos de la carpeta models, requerirlos y definirlos en sequelize
const modelsDir = path.join(__dirname, './models');
fs.readdirSync(modelsDir).forEach(file => {
  const model = require(path.join(modelsDir, file));
  model(sequelize);
});

// Capitaliza los nombres de los modelos para que sean consistentes
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelize.models = Object.fromEntries(capsEntries);


const { Games, Category, Consol, Company } = sequelize.models;

// Aca vendrian las relaciones
Games.belongsToMany(Category, {through: 'games_cat', onDelete: 'CASCADE',timestamps: false});
Category.belongsToMany(Games, {through: 'games_cat', onDelete: 'CASCADE',timestamps: false});

Games.belongsToMany(Consol, {through: 'games_consol', onDelete: 'CASCADE',timestamps: false});
Consol.belongsToMany(Games, {through: 'games_consol', onDelete: 'CASCADE',timestamps: false});

// Relación uno a muchos con Company
Company.hasMany(Games, { foreignKey: 'companyId', onDelete: 'CASCADE', timestamps: false });
Games.belongsTo(Company, { foreignKey: 'companyId', onDelete: 'CASCADE', timestamps: false });

// Exporta los modelos y la conexión
module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Model } = require('./config/database');
  conn: sequelize,     // para importar la conexión { conn } = require('./config/database');
};