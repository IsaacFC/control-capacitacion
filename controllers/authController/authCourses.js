const db = require('../../db');
var moment = require('moment');


// Bandera que indica el empalme de horario (se usa en funcion registerCourses)
var lap = 0;
// Indica que hay empalme de horario
function isOverlapped() {
    lap = 1;
};
// Reinicia la bandera
function notOverlapped() {
    lap = 0;
};
// Imprime la bandera y retorna el valor de la bandera
function alertLap() {
    console.log(lap);
    return lap;
};

exports.registerCourses = (req, res, next) => {
    try {

        const {
            course, group, instructor, department, courseType,
            trainingType, periodStart, periodEnd, hourStart, hourEnd, hourNumber,
            classroom, partakerLimit, showCourse, addressedTo, observations
        } = req.body;

        db.query('SELECT rfc FROM usuario WHERE (SELECT CONCAT(nombre_usuario, \' \', apellido_paterno, \' \', apellido_materno)) = ?', [instructor], async (error, results) => {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el grupo (registrar): ' + error
                });
            };
            if (results.length < 1) {
                return res.status(409).send({
                    message: 'Favor de seleccionar instructor'
                });
            } else {
                var rfc = results[0].rfc;
            };
            db.query('SELECT * FROM curso WHERE nombre_instructor = ? OR aula = ? AND aula <> \'Virtual\' AND aula <> \'Online\'', [instructor, classroom], async (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        message: 'Error al consultar el instructor (registrar): ' + error
                    });
                };

                if (results.length > 0) {
                    // Compara cada fila para determinar si hay empalme de horario
                    Object.keys(results).forEach(function (key) {
                        var row = results[key];
                        if ((new Date(periodStart) <= new Date(row.periodo_final)) && (new Date(row.periodo_inicial) <= new Date(periodEnd))) {
                            if ((moment(new Date(row.hora_inicial)).format("HH:mm") < moment(new Date(hourEnd)).add(7, 'hours').format("HH:mm")) 
                            && (moment(new Date(hourStart)).add(7, 'hours').format("HH:mm") < moment(new Date(row.hora_final)).format("HH:mm"))) {
                                // Indica que hay empalme
                                isOverlapped();
                            };
                        };
                    });
                    // Si hay empalme, entonces manda mensaje al cliente
                    if (alertLap() === 1) {
                        notOverlapped();
                        return res.status(409).send({
                            message: 'No se puede registrar el curso. El profesor o aula tendría empalme de horas.'
                        });
                    };
                };
                console.log(periodStart)
                console.log(periodEnd)
                db.query('INSERT INTO curso SET ?', {
                    nombre_curso: course,
                    grupo: group,
                    rfc: rfc,
                    nombre_instructor: instructor,
                    departamento: department,
                    tipo_curso: courseType,
                    tipo_capacitacion: trainingType,
                    periodo_inicial: periodStart,
                    periodo_final: periodEnd,
                    hora_inicial: hourStart,
                    hora_final: hourEnd,
                    num_horas: hourNumber,
                    aula: classroom,
                    limite_participantes: partakerLimit,
                    mostrar_curso: showCourse,
                    dirigido_a: addressedTo,
                    observaciones: observations,
                }, (error, results) => {
                    //console.log(error);
                    // si la llave primaria está en la BD... entonces despliega error
                    if (error) {
                        if (error.errno === 1452) {
                            return res.status(409).send({
                                message: 'No existe un usuario con ese nombre'
                            });
                        } else if (error.errno === 1062) {
                            return res.status(409).send({
                                message: 'No se puede registrar el curso. Ya existe un curso con el grupo \'' + group + '\''
                            });
                        };
                    } else {
                        console.log('Curso creado')
                        return res.status(201).send('Curso creado');
                    };
                });
            });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al registrar curso. \nError: ' + error
        });

    }
}

exports.modifyCourse = async (req, res) => {

    try {

        const {
            course, group, instructor, department, courseType,
            trainingType, periodStart, periodEnd, hourStart, hourEnd, hourNumber,
            classroom, partakerLimit, showCourse, addressedTo, observations
        } = req.body;



        // Verifica si el curso está llevándose a cabo
        db.query('SELECT * FROM cedula_inscripcion WHERE grupo = ?', [group], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar el grupo en inscripciones (modificar): ' + error
                });
            }
            if (result.length > 0) {
                console.log('Ya hay usuarios inscritos. No se puede modificar.');
                return res.status(409).send({
                    message: 'No se puede modificar este curso porque existen usuarios inscritos o ya se llevó a cabo.'
                });
            }
            // Busca el RFC del instructor seleccionado
            db.query('SELECT rfc FROM usuario WHERE (SELECT CONCAT(nombre_usuario, \' \', apellido_paterno, \' \', apellido_materno)) = ?', [instructor], async (error, results) => {
                if (error) {
                    console.log('error:');
                    console.log(error);
                    return res.status(500).send({
                        message: 'Error al consultar el grupo (modificar): ' + error
                    });
                }
                if (results.length < 1) {
                    return res.status(409).send({
                        message: 'Favor de seleccionar instructor'
                    });
                } else {
                    var rfc = results[0].rfc;
                }
                db.query('SELECT * FROM curso WHERE (nombre_instructor = ? OR aula = ?) AND grupo != ? AND aula <> \'Virtual\' AND aula <> \'Online\'', [instructor, classroom, group], async (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({
                            message: 'Error al consultar el instructor (registrar): ' + error
                        });
                    }

                    if (results.length > 0) {
                        // Compara cada fila para determinar si hay empalme de horario
                        Object.keys(results).forEach(function (key) {
                            var row = results[key];
                            if ((new Date(periodStart) <= new Date(row.periodo_final)) && (new Date(row.periodo_inicial) <= new Date(periodEnd))) {
                                if ((moment(new Date(row.hora_inicial)).format("HH:mm") < moment(new Date(hourEnd)).add(7, 'hours').format("HH:mm")) && (moment(new Date(hourStart)).add(7, 'hours').format("HH:mm") < moment(new Date(row.hora_final)).format("HH:mm"))) {
                                    // Indica que hay empalme
                                    isOverlapped();
                                }
                            }
                        });
                        // Si hay empalme, entonces manda mensaje al cliente
                        if (alertLap() === 1) {
                            notOverlapped();
                            return res.status(409).send({
                                message: 'No se puede modificar el curso porque el profesor o aula tendría empalme de horas.'
                            });
                        }
                    }
                    console.log(periodStart)
                    console.log(periodEnd)
                    db.query('UPDATE curso SET nombre_curso = ?, ' +
                        'grupo = ?, ' +
                        'nombre_instructor = ?, ' +
                        'rfc = ?,' +
                        'departamento = ?, ' +
                        'tipo_curso = ?, ' +
                        'tipo_capacitacion = ?, ' +
                        'periodo_inicial = ?, ' +
                        'periodo_final = ?, ' +
                        'hora_inicial = ?, ' +
                        'hora_final = ?, ' +
                        'num_horas = ?, ' +
                        'aula = ?, ' +
                        'limite_participantes = ?, ' +
                        'mostrar_curso = ?, ' +
                        'dirigido_a = ?, ' +
                        'observaciones = ? WHERE grupo = ?',
                        [course, group, instructor, rfc, department, courseType, trainingType, periodStart, periodEnd, hourStart, hourEnd, hourNumber, classroom, partakerLimit, showCourse, addressedTo, observations, group], async (error, results) => {
                            if (error) {
                                return res.status(500).send({
                                    message: 'Error al modificar curso' + error
                                });
                            } else {
                                console.log('Curso modificado');
                                return res.status(201).send('Curso modificado');
                            }
                        });
                });

            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al modificar curso. \nError: ' + error
        });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        console.log('Eliminar: ' + req.params.tagId);
        const grupo = req.params.tagId;



        db.query('SELECT * FROM cedula_inscripcion WHERE grupo = ?', [grupo], (error, results) => {

            if (results.length > 0) {

                db.query('DELETE FROM cedula_inscripcion WHERE grupo = ?', [grupo], (error, results) => {
                    if (error) {
                        if (error.errno === 1451) {
                            return res.status(401).send({
                                message: 'Este grupo tiene asistencias registradas y no se puede eliminar.'
                            });
                        }
                    } else {
                        console.log('Inscripciones eliminadas');
                    };
                });
            };
            db.query('DELETE FROM curso WHERE grupo = ?', [grupo], (error, result) => {
                if (error) {
                    if (error.errno === 1451) {
                        return res.status(401).send({
                            message: 'Este grupo tiene inscritos y asistencias registradas. No se puede eliminar.'
                        });
                    } else {
                        return res.status(500).send({
                            message: 'Error al eliminar el grupo: ' + error
                        });
                    }
                } else {
                    console.log('Curso eliminado');
                    return res.status(200).send({
                        message: 'Curso eliminado'
                    });
                }
            });
        });


    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al eliminar curso. \nError: ' + error
        });
    }
}