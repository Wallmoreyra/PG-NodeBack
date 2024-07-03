// const express = require('express');
// const path = require('path');

// // Initializations
// const app = express();

// // Settings
// app.set('port', process.env.PORT || 4000);
// app.set('views', path.join(__dirname, 'views'))

// // Middlewares
// app.use(express.urlencoded({extended: false}))

// // Global Variables

// // Routes
// app.get('/', (req, res) => {
//     res.send('Hola mundo!!!!')
// });

// // Static Files
// app.use(express.static(path.join(__dirname, 'public')));



// module.exports = app;

//---------------------------------------------------------------
const router = require("./routes");
const express = require('express');
const path = require('path');
const cors = require('cors'); // Añadir CORS si es necesario

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Añadir para trabajar con JSON
app.use(cors());

// Variables globales

// Rutas
app.use(router);
// app.get('/', (req, res) => {
//   res.send('Hola mundo!!!!');
// });

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;