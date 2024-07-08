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
  ...sequelize.models,
  conn: sequelize,
};