const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');



// Toma los datos de todos los usuarios para ser insertados en la tabla
// users-overview
exports.getUsers = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Valida que el tipo de usuario sea COORDINADOR
        db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
            if (result[0].tipo_usuario === 'COORDINADOR') {
                // Busca todos los usuarios excepto al usuario que tiene sesion iniciada
                db.query('SELECT * FROM usuario WHERE rfc <> ?', [decoded.id], (error, result) => {
                    if (error) {
                        return res.status(500).send({
                            message: 'Error al consultar los usuarios (gestion de usuarios): ' + error
                        });
                    };
                    let resArray = [];
                    var data = {};
                    if (result.length < 1) {
                        resArray.push(data);
                        return res.status(200).send(resArray);
                    }
                    Object.keys(result).forEach(function (key) {
                        var row = result[key];
                        data = {
                            name: row.nombre_usuario +
                                ' ' + row.apellido_paterno +
                                ' ' + row.apellido_materno,
                            rfc: row.rfc,
                            email: row.email,
                            userType: row.tipo_usuario,
                        };
                        resArray.push(data);

                        if ((result.length - 1) == key) {
                            console.log('Usuarios cargados');
                            return res.status(200).send(resArray);
                        }
                    });
                });
            } else {
                return res.status(401).send({
                    message: 'Acceso denegado'
                });
            }
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener usuarios. \nError: ' + error
        });
    }
}


exports.getUserByRfc = async (req, res) => {
    try {
        const rfc = req.params.tagId;
        console.log(rfc);
        db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, result) => {
            console.log(result);
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar el usuario (obtener usuario): ' + error
                });
            };

            const data = {
                name: result[0].nombre_usuario,
                firstLastName: result[0].apellido_paterno,
                secondLastName: result[0].apellido_materno,
                rfc: rfc,
                gender: result[0].genero,
                department: result[0].departamento_usuario,
                email: result[0].email,
                phoneNumber: result[0].telefono,
                plaza: result[0].plaza,
                userType: result[0].tipo_usuario,
            };


            console.log('Usuario cargado con ID ' + req.params.tagId);
            return res.status(200).send(data);

        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener usuario. \nError: ' + error
        });
    }
}