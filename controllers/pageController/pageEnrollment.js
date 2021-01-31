const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');




exports.getEnrollmentCourses = async (req, res) => {
    try {

        db.query('SELECT * FROM curso WHERE mostrar_curso = 1', (error, cursos) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar curso para inscripción (obtener cursos insc.): ' + error
                });
            };
            if (cursos.length < 1) {
                return res.status(200).send(cursos);
            }

            let resArray = [];
            Object.keys(cursos).forEach(function (key) {
                var row = cursos[key];
                db.query('SELECT COUNT(*) AS total FROM cedula_inscripcion WHERE grupo = ?', [row.grupo], (error, result) => {

                    // console.log(moment(new Date(row.hora_inicial)).format("HH:mm"));
                    const data = {
                        course: row.nombre_curso,
                        quota: row.limite_participantes - result[0].total,
                        instructor: row.nombre_instructor,
                        trainingType: row.tipo_capacitacion,
                        period: moment(new Date(row.periodo_inicial)).format("DD-MM-YYYY")
                            + ' al '
                            + moment(new Date(row.periodo_final)).format("DD-MM-YYYY")
                            + ' | ' +
                            moment(new Date(row.hora_inicial)).format("HH:mm")
                            + ' - '
                            + moment(new Date(row.hora_final)).format("HH:mm"),
                        hours: row.num_horas,
                        classroom: row.aula,
                        addressedTo: row.dirigido_a,
                        group: row.grupo,
                    };
                    resArray.push(data);
                    if ((cursos.length - 1) == key) {
                        console.log('Cursos cargados');    
                        return res.status(200).send(resArray);
                    }
                });
                
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al obtener cursos para inscripción. \nError: ' + error
        });
    }
}

exports.getEnrollmentForm = async (req, res) => {
    if (req.cookies.jwt) {
        try {

            // 1. Verificar el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            const grupo = req.params.tagId;

            db.query('SELECT * FROM cedula_inscripcion WHERE rfc = ? and grupo = ?', [decoded.id, grupo], (error, result) => {
                if (error) {
                    return res.status(500).send({
                        message: 'Error al buscar usuario: ' + error
                    });
                }
                if (result.length > 0) {
                    console.log('Ya te has inscrito a este curso');
                    return res.status(409).send({
                        message: 'No es posible inscribirse. Ya se encuentra inscrito al grupo \'' + grupo + '\'.'
                    });
                }
                db.query('SELECT COUNT(*) AS total FROM cedula_inscripcion WHERE grupo = ?', [grupo], (error, result) => {
                    if (error) {
                        return res.status(500).send({
                            message: 'Error al buscar usuario: ' + error
                        });
                    }
                    
                    var numeroInscritos = result[0].total;

                    db.query('SELECT * FROM curso, usuario WHERE grupo = ? AND usuario.rfc = ?', [grupo, decoded.id], (error, results) => {
                        if (error) {
                            return res.status(500).send({
                                message: 'Error al consultar usuario y grupo para inscripción (obtener form): ' + error
                            });
                        };
                        var fecha = new Date();
                        fecha.setHours(fecha.getHours() - 7);
                        if (results[0].periodo_inicial < fecha) {
                            return res.status(401).send({
                                message: 'No es posible inscribirse. El curso se está llevando a cabo o ha finalizado.'
                            });
                        };
                        console.log(results[0].genero)
                        console.log(results[0].departamento_usuario)
                        if (numeroInscritos < results[0].limite_participantes) {
                            const data = {
                                name: results[0].nombre_usuario,
                                firstLastName: results[0].apellido_paterno,
                                secondLastName: results[0].apellido_materno,
                                rfc: decoded.id,
                                gender: results[0].genero,
                                department: results[0].departamento_usuario,
                                email: results[0].email,
                                plaza: results[0].plaza,
                                phoneNumber: results[0].telefono,
                                course: results[0].nombre_curso,
                                instructor: results[0].nombre_instructor,
                                courseDate: moment(new Date(results[0].periodo_inicial)).format("DD-MM-YYYY")
                                    + ' al '
                                    + moment(new Date(results[0].periodo_final)).format("DD-MM-YYYY"),
                                courseSchedule: moment(new Date(results[0].hora_inicial)).format("hh:mm")
                                    + ' - '
                                    + moment(new Date(results[0].hora_final)).format("hh:mm"),
                                campus: 'TecNM Campus Hermosillo',
                                classroom: results[0].aula,
                                hours: results[0].num_horas,
                                group: grupo,
                            };

                            console.log('Enrollment cargado con ID ' + req.params.tagId
                                + ' y RFC: ' + decoded.id);
                            return res.status(200).send(data);
                        } else {
                            return res.status(401).send({
                                message: 'El grupo ha excedido su límite de participantes.'
                            });
                        }
                    });
                });
            });

        } catch (error) {
            return res.status(500).send({
                message: 'Error con el servidor al obtener form para inscripción. \nError: ' + error
            });
        }
    }
}