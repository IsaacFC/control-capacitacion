const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');

exports.updateUserConfig = async (req, res) => {
    console.log('AAAAA');
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded.id);
            const { name, firstLastName, secondLastName, gender, department, email, phoneNumber, plaza } = req.body;
            //var newRfcUpper = newRfc.toUpperCase();
            console.log('Update');
            db.query('UPDATE usuario SET nombre_usuario = ?, ' +
                'apellido_paterno = ?, ' +
                'apellido_materno = ?, ' +
                'genero = ?, ' +
                'departamento_usuario = ?, ' +
                'email = ?, ' +
                'plaza = ?, ' +
                'telefono = ? WHERE rfc = ?', [name, firstLastName, secondLastName, gender, department, email, plaza, phoneNumber, decoded.id], async (error, results) => {

                    if (error) {
                        return res.status(500).send({
                            message: 'Error al modificar configuracion de usuario: '
                        });
                    } else {
                        console.log('Configuracion de usuario modificada');
                        return res.status(201).send('Usuario modificado');
                    }
                });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: 'Error con el servidor al actualizar datos del usuario. \nError: ' + error
            });
        }
    }

}

exports.changePassword = async (req, res) => {
    if (req.cookies.jwt) {

        try {
            const { password, newPassword } = req.body;

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            db.query('SELECT contrasena FROM usuario WHERE rfc = ?', [decoded.id], async (error, results) => {

                if (error) {
                    return res.status(500).send({
                        message: 'Error al cambiar contraseña del usuario: ' + error
                    });
                }


                if (results.length > 0) {
                    if (!(await bcryptjs.compare(password, results[0].contrasena))) {
                        return res.status(400).send({
                            message: 'Su contraseña actual es incorrecta.'
                        });
                    }
                    if ((await bcryptjs.compare(newPassword, results[0].contrasena))) {
                        return res.status(400).send({
                            message: 'Digite una nueva contraseña diferente a la actual.'
                        });
                    }
                }

                // encripta la contraseña con 8 rondas
                let newEncryptedPassword = await bcryptjs.hash(newPassword, 8);
                console.log(newEncryptedPassword);


                db.query('UPDATE usuario SET contrasena = ? WHERE rfc = ?', [newEncryptedPassword, decoded.id], (error, results) => {
                    // si la llave primaria está en la BD... entonces despliega error
                    if (error) {
                        return res.status(500).send({
                            message: 'Error al actualizar contraseña: ' + error
                        });
                    } else {
                        console.log(results);
                        return res.status(200).send('Contraseña actualizada');
                    }
                });

            });
        } catch (error) {
            return res.status(500).send({
                message: 'Error con el servidor al actualizar contraseña. \nError: ' + error
            });
        }
    }
}