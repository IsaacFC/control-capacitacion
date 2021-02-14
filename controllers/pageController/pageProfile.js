const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');


exports.verifyToken = async (req, res, next) => {
    if (req.cookies.jwt) {
        console.log('verificar');
        let accessToken = req.cookies.jwt;
        try {
            // 1. Verificar el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // 2. Verificar si el usuario existe
            db.query('SELECT * FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
                // console.log(result);
                if (!result) {
                    console.log('no hay resultados');
                    return res.status(401).send();
                };
                console.log('hay resultados');
                // return res.status(401).send();
                return next();

            });

        } catch (error) {
            return res.status(401).send();
        };
    } else {
        return res.status(403).send();
    };
};

// Toma los datos del usuario en sesión para desplegarlos en su pagina 
// de configuración
exports.getProfileData = async (req, res) => {

    if (req.cookies.jwt) {
        try {
            // 1. Verificar el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // 2. Verificar si el usuario existe
            db.query('SELECT * FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
                //console.log(result);
                if (!result) {
                    return res.status(500).send({
                        message: 'Error al consultar el usuario (configuracion usuario): ' + error
                    });
                };

                const data = {
                    name: result[0].nombre_usuario,
                    firstLastName: result[0].apellido_paterno,
                    secondLastName: result[0].apellido_materno,
                    gender: result[0].genero,
                    department: result[0].departamento_usuario,
                    email: result[0].email,
                    phoneNumber: result[0].telefono,
                    plaza: result[0].plaza,
                };
                console.log('COOKIES: ');
                console.log(req.cookies.jwt)
                return res.status(201).send(data);

            });

        } catch (error) {
            return res.status(500).send({
                message: 'Error con el servidor al obtener configuracion de usuario. \nError: ' + error
            });
        }
    } else {
        return res.send('Sesion expirada');
    }
}

