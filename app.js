const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var bodyParser = require('body-parser');
const filemanagerMiddleware = require('@opuscapita/filemanager-server').middleware;

// Para iniciar servidor
const app = express();

app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
// inicializa para poner cookies
app.use(cookieParser());

app.use(cors());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const root = require('path').join(__dirname, './build')
app.use(express.static(root));



// Definir las rutas/direcciones para requests. 
// De estos archivos se cargan o envian peticiones.
app.use('/auth', require('./pages/auth'));
app.use('/api', require('./pages/pages'));

const config = {
    fsRoot: path.resolve(__dirname, './controllers/authController/Documentos'),
    rootName: 'Principal',
    readOnly: false,
  };

app.use('/files', filemanagerMiddleware(config));


app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});
const PORT = 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});

