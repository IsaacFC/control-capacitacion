const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');

exports.registerUser = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], async (error, result) => {
            if (result[0].tipo_usuario === 'COORDINADOR') {
                const { rfc, userType } = req.body;
                var rfcUpper = rfc.toUpperCase();
        
                // encripta la contraseña con 8 rondas
                let contrasenaEncriptada = await bcryptjs.hash((rfc + '@!'), 8);
                console.log(contrasenaEncriptada);
        
        
                db.query('INSERT INTO usuario SET ?', {
                    nombre_usuario: 'NA',
                    apellido_paterno: 'NA',
                    apellido_materno: 'NA',
                    rfc: rfcUpper,
                    genero: '-',
                    departamento_usuario: 'NA',
                    tipo_usuario: userType,
                    plaza: 'NA',
                    contrasena: contrasenaEncriptada
                }, (error, results) => {
                    // si la llave primaria está en la BD... entonces despliega error
                    if (error) {
                        console.log(error);
                        if (error.errno === 1062) {
                            return res.status(409).send({
                                message: 'El RFC \'' + rfcUpper + '\' ya existe'
                            });
                        }
                    } else {
                        return res.status(201).send('Usuario creado');
                    }
                });
            } else {
                return res.status(401).send({
                    message: 'Acceso denegado'
                });
            }
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al registrar usuario. \nError: ' + error
        });
    }
}

exports.modifyUser = async (req, res) => {

    try {

        const {
            name, firstLastName, secondLastName, rfc, newRfc, email, phoneNumber,
            plaza, userType
        } = req.body;
        console.log(plaza);
        var newRfcUpper = newRfc.toUpperCase();

        db.query('SELECT * FROM usuario WHERE rfc = ?', [newRfcUpper], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            console.log(newRfcUpper);
            if (result.length > 0) {
                console.log('El RFC \'' + newRfcUpper + '\' ya existe.');
                return res.status(400).send({
                    message: 'El RFC \'' + newRfcUpper + '\' ya existe.'
                });
            }
            if (newRfcUpper !== '') {
                db.query('UPDATE usuario SET nombre_usuario = ?, ' +
                    'apellido_paterno = ?, ' +
                    'apellido_materno = ?, ' +
                    'rfc = ?, ' +
                    'genero = ?, ' +
                    'departamento_usuario = ?, ' +
                    'email = ?, ' +
                    'telefono = ?, ' +
                    'plaza = ?, ' +
                    'tipo_usuario = ? WHERE rfc = ?',
                    [name, firstLastName, secondLastName, newRfcUpper, email, phoneNumber, plaza, userType, rfc], async (error, results) => {

                        if (error) {
                            if (error.errno === 1451) {
                                console.log('Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.');
                                return res.status(409).send({
                                    message: 'Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.'
                                });
                            }
                        } else {
                            //console.log('Usuario modificado ');
                            //return res.send(results);
                            return res.status(200).send({
                                message: 'Usuario modificado'
                            });

                        }
                    });
            } else {
                db.query('UPDATE usuario SET nombre_usuario = ?, ' +
                    'apellido_paterno = ?, ' +
                    'apellido_materno = ?, ' +
                    'email = ?, ' +
                    'telefono = ?, ' +
                    'plaza = ?, ' +
                    'tipo_usuario = ? WHERE rfc = ?',
                    [name, firstLastName, secondLastName, email, phoneNumber, plaza, userType, rfc], async (error, results) => {

                        if (error) {
                            return res.status(500).send({
                                message: 'Error al modificar el usuario: ' + error
                            });
                        } else {
                            console.log('Usuario modificado ');
                            //return res.send(results);
                            return res.status(200).send('Usuario modificado');

                        }
                    });
            }

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al modificar usuario. \nError: ' + error
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        console.log('Eliminar: ' + req.params.tagId);
        const rfc = req.params.tagId;
        db.query('DELETE FROM usuario WHERE rfc = ?', [rfc], (error, result) => {
            if (error) {
                if (error.errno === 1451) {
                    console.log('Este usuario imparte o se ha inscrito a un curso. No se puede borrar.');
                    return res.status(409).send({
                        message: 'Este usuario imparte o se ha inscrito a un curso. No se puede borrar.'
                    });
                }
            } else {
                console.log('Usuario eliminado');
                return res.status(200).send({
                    message: 'Usuario eliminado'
                });
            }
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al eliminar usuario. \nError: ' + error
        });
    }
}

exports.restoreUserPassword = async (req, res) => {
    try {
        console.log('Reestablecer: ' + req.params.tagId);
        const rfc = req.params.tagId;

        const newPassword = rfc + '@!';
        // encripta la contraseña con 8 rondas
        let newEncryptedPassword = await bcryptjs.hash(newPassword, 8);
        console.log(newEncryptedPassword);

        db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar el usuario (reestablecer contraseña): ' + error
                });
            }

            db.query('UPDATE usuario SET contrasena = ? WHERE rfc = ?', [newEncryptedPassword, rfc], (error, results) => {
                // si la llave primaria está en la BD... entonces despliega error
                if (error) {
                    return res.status(500).send({
                        message: 'Error al reestablecer contraseña: ' + error
                    });
                } else {
                    console.log('Contraseña reestablecida');
                    return res.status(200).send({
                        message: 'Contraseña reestablecida'
                    });
                }
            });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al reestablecer contraseña. \nError: ' + error
        });
    }
}
