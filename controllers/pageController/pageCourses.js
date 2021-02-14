const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');

// Toma los datos de todos los cursos para ser insertados en la tabla
// courses-overview
exports.getCourses = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], (error, result) => {
            if (result[0].tipo_usuario === 'COORDINADOR') {
                db.query('SELECT * FROM curso', (error, result) => {
                    if (error) {
                        return res.status(500).send({
                            message: 'Error al consultar los cursos (gestion de cursos): ' + error
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
                        //console.log(moment(new Date(row.periodo_final)).format("DD-MM-YYYY"))
                        if (row.mostrar_curso == 1) {
                            data = {
                                course: row.nombre_curso,
                                group: row.grupo,
                                department: row.departamento,
                                instructor: row.nombre_instructor,
                                courseType: row.tipo_curso,
                                trainingType: row.tipo_capacitacion,
                                period: moment(new Date(row.periodo_inicial)).format("DD-MM-YYYY")
                                    + ' al '
                                    + moment(new Date(row.periodo_final)).format("DD-MM-YYYY"),
                                schedule: moment(new Date(row.hora_inicial)).format("HH:mm")
                                    + ' - '
                                    + moment(new Date(row.hora_final)).format("HH:mm"),
                                showCourse: 'Sí',
                            };
                        } else {
                            data = {
                                course: row.nombre_curso,
                                group: row.grupo,
                                department: row.departamento,
                                instructor: row.nombre_instructor,
                                courseType: row.tipo_curso,
                                trainingType: row.tipo_capacitacion,
                                period: moment(new Date(row.periodo_inicial)).format("DD-MM-YYYY")
                                    + ' al '
                                    + moment(new Date(row.periodo_final)).format("DD-MM-YYYY"),
                                schedule: moment(new Date(row.hora_inicial)).format("HH:mm")
                                    + ' - '
                                    + moment(new Date(row.hora_final)).format("HH:mm"), showCourse: 'No',
                            };
                        }
                        resArray.push(data);

                        if ((result.length - 1) == key) {

                            console.log('Cursos cargados');                            
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
            message: 'Error con el servidor al obtener cursos. \nError: ' + error
        });
    }
}

exports.getCourseByGroup = async (req, res) => {

    try {
        const grupo = req.params.tagId;
        db.query('SELECT * FROM curso WHERE grupo = ?', [grupo], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar curso por grupo (obtener curso): ' + error
                });
            };
            console.log(new Date(result[0].periodo_inicial));
            console.log(new Date(result[0].periodo_final));

            const data = {
                course: result[0].nombre_curso,
                group: grupo,
                instructor: result[0].nombre_instructor,
                department: result[0].departamento,
                courseType: result[0].tipo_curso,
                trainingType: result[0].tipo_capacitacion,
                periodStart: result[0].periodo_inicial,
                periodEnd: result[0].periodo_final,
                hourStart: new Date(result[0].hora_inicial),
                hourEnd: new Date(result[0].hora_final),
                hourNumber: result[0].num_horas,
                classroom: result[0].aula,
                partakerLimit: result[0].limite_participantes,
                showCourse: result[0].mostrar_curso,
                addressedTo: result[0].dirigido_a,
                observations: result[0].observaciones,
            };

            console.log('Curso cargado con ID ' + req.params.tagId);
            return res.status(200).send(data);

        });


    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener curso por grupo. \nError: ' + error
        });
    }
}


// Toma todos los instructores para el Autocomplete
exports.getInstructor = async (req, res) => {
    try {
        db.query(`SELECT nombre_usuario, apellido_paterno, apellido_materno FROM usuario 
        WHERE nombre_usuario <> 'NA' OR apellido_paterno <> 'NA' OR apellido_materno <> 'NA' `, (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar instructores (obtener instructor): ' + error
                });
            };
            let resArray = [];
            Object.keys(result).forEach(function (key) {
                var row = result[key];
                var nombreInstructor = row.nombre_usuario
                    + ' ' + row.apellido_paterno
                    + ' ' + row.apellido_materno;
                const data = {
                    instructor: nombreInstructor
                };
                resArray.push(data);
                if ((result.length - 1) == key) {
                    console.log('Instructores cargados');
                    return res.status(200).send(resArray);
                }
            });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener instructores. \nError: ' + error
        });
    }
}