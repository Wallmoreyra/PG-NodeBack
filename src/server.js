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
const { engine } = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        ifCond: function(v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
    }
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Añadir para trabajar con JSON
app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
// Variables globales

// Rutas
app.use(router);
// app.get('/', (req, res) => {
//   res.send('Hola mundo!!!!');
// });



// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;