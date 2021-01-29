const path = require('path');
let filemanager = require('@opuscapita/filemanager-server');
const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env' });
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');


exports.getDocuments = async (req, res) => {

    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
            if (result[0].tipo_usuario === 'COORDINADOR') {
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        message: 'Error al consultar los cursos (gestion de cursos): ' + error
                    });
                };
                console.log(path.join(__dirname, '../authController/Documentos/'))
                
                
                let config = {
                    fsRoot: path.join(__dirname, '../authController/Documentos/'),
                    rootName: 'Principal',
                    port: process.env.PORT || '5000',
                    host: process.env.HOST || 'localhost'
                };

                filemanager.server.run(config);
                return res.status(200).send('');
            }  else {
                return res.status(401).send({
                    message: 'Acceso denegado'
                });
            }
        });


    } catch (error) {
        //console.log(error)
        return res.status(500).send({
            message: 'Error con el servidor al obtener documentos. \nError: ' + error
        });
    }
}

