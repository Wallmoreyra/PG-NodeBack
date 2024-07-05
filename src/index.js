// require('dotenv').config();

// const app = require('./server');
// const pool = require('./database');

// console.log(process.env.TESTING)

// app.listen(app.get('port'), () => {
//     console.log('Servidor escuchando en puerto: ', app.get('port'))
// })

require('dotenv').config();

const app = require('./server');
const { conn } = require('./database');

console.log(process.env.TESTING);

conn.sync({ force: false }) // Cambia a true si deseas recrear las tablas en cada inicio
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log('Servidor escuchando en puerto: ', app.get('port'));
    });
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });