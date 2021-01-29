const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var cursos = [];

var arrDias = [];
var arrAsistencia = [];
var diasAsistidos = [];

// Inserta en el array los datos a insertar en la tabla
function saveCourses(data) {
    cursos.push(data);
};

// Obtiene los valores del array a insertar en la tabla
function alertCursos() {
    return cursos;
};

function getWeekDay(date) {
    switch (date) {
        case 0:
            return 'Domingo:';
        case 1:
            return 'Lunes:';
        case 2:
            return 'Martes:';
        case 3:
            return 'Miércoles:';
        case 4:
            return 'Jueves:';
        case 5:
            return 'Viernes:';
        case 6:
            return 'Sábado:';
    };
};

// Toma los datos de todos los cursos a los que el usuario está inscrito
// /mycourses
exports.getMyCourses = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        console.log(decoded.id);
        // Selecciona todos los cursos a los que el usuario está inscrito
        db.query('SELECT * FROM cedula_inscripcion WHERE rfc = ?', [decoded.id], (error, results) => {

            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar mis cursos (MyCourses): ' + error
                });
            };

            if (results.length < 1) {
                return res.status(200).send(results);
            }

            let arrayGrupos = [];
            let resArray = [];
            cursos = [];

            // Inserta en un array (arrayGrupos) el grupo de cada curso
            Object.keys(results).forEach(function (key) {
                var row = results[key];
                arrayGrupos.push(row.grupo);

                if ((results.length - 1) == key) {
                    console.log('Cursos cargados');
                }
            });

            // Busca los datos de cada curso con los grupos insertados en el array (arrayGrupos)
            Object.keys(arrayGrupos).forEach(function (key) {
                var row = arrayGrupos[key];
                db.query('SELECT * FROM curso WHERE grupo = ?', [row], (error, curso) => {
                    var fecha = new Date();
                    fecha.setHours(fecha.getHours() - 7);

                    if (curso[0].periodo_inicial > fecha && curso[0].periodo_final > fecha) {
                        var status = 'Por cursar'
                    }
                    if (curso[0].periodo_inicial < fecha && curso[0].periodo_final > fecha) {
                        var status = 'En curso'
                    }
                    if (curso[0].periodo_inicial < fecha && curso[0].periodo_final < fecha) {
                        var status = 'Finalizado'
                    }
                    db.query('SELECT * FROM usuario WHERE rfc = ?', [curso[0].rfc], (error, usuario) => {
                        const data = {
                            course: curso[0].nombre_curso,
                            group: //results[0].aula + ' — ' + 
                                curso[0].grupo,
                            period: moment(new Date(curso[0].periodo_inicial)).format("DD-MM-YYYY")
                                + ' al '
                                + moment(new Date(curso[0].periodo_final)).format("DD-MM-YYYY")
                                + '\n Horario: ' + moment(new Date(curso[0].hora_inicial)).format("HH:mm")
                                + ' - '
                                + moment(new Date(curso[0].hora_final)).format("HH:mm"),
                            status: status,
                            "instructor": curso[0].nombre_instructor + ' | ' + usuario[0].email,
                            department: curso[0].departamento,
                            classroom: curso[0].aula,
                            trainingType: curso[0].tipo_capacitacion,
                        };
                        resArray.push(data);
                        saveCourses(data);
                        if ((arrayGrupos.length - 1) == key) {
                            console.log('Mis cursos cargados');
                            return res.status(200).send(alertCursos());
                        }
                    });
                });
            });
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener mis cursos. \nError: ' + error
        });
    }
}

exports.getCourseEvaluationInfo = async (req, res) => {

    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        const group = req.params.tagId;

        //var dir = path.resolve(__dirname, '../authController/evaluaciones/ENCUESTA- ' + decoded.id + ' - ' + group + '.docx');
        var files = searchRecursive(path.resolve('./controllers/authController/Documentos/evaluaciones'), 'ENCUESTA-' + decoded.id + ' - ' + group + '.docx');

        console.log(files.length);
        // Si la evaluación existe, entonces regresa
        if (files.length > 0) {
            return res.status(401).send({
                message: 'Usted ya evaluó al docente'
            });
        };

        db.query('SELECT * FROM cedula_inscripcion WHERE grupo = ? AND rfc = ?', [group, decoded.id], (error, results) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar datos del grupo (evaluation Form): ' + error
                });
            };
            var responsibleUnit = results[0].unidad_responsable;

            db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, results) => {
                if (error) {
                    return res.status(500).send({
                        message: 'Error al consultar datos del grupo (evaluation Form): ' + error
                    });
                };
                var fecha = new Date();
                fecha.setHours(fecha.getHours() - 7);
                if (results[0].periodo_final > fecha) {
                    return res.status(401).send({
                        message: 'Evaluación no disponible hasta el último día del curso'
                    });
                };

                const data = {
                    course: results[0].nombre_curso,
                    responsibleUnit: responsibleUnit,
                    instructor: results[0].nombre_instructor,
                    campus: 'TecNM Campus Hermosillo',
                    courseDate: moment(new Date(results[0].periodo_inicial)).format("DD-MM-YYYY")
                        + ' al '
                        + moment(new Date(results[0].periodo_final)).format("DD-MM-YYYY"),
                    hours: results[0].num_horas,
                    courseSchedule: moment(new Date(results[0].hora_inicial)).format("HH:mm")
                        + ' - '
                        + moment(new Date(results[0].hora_final)).format("HH:mm"),
                    group: group,
                };

                console.log('Curso cargado con ID ' + req.params.tagId);
                return res.status(200).send(data);

            });
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al obtener evaluacion del curso. \nError: ' + error
        });
    }
}

exports.getAttendanceInfo = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        const group = req.params.tagId;

        db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, curso) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar datos del grupo (asistencia): ' + error
                });
            };
            if (curso.length < 1) {
                return res.status(404).send({
                    message: 'Pagina no encontrada'
                });
            };

            // Obtiene el numero de dias entre la fecha inicial y final del curso
            var diaActual = new Date();
            var diasInicial = new Date(curso[0].periodo_inicial);
            var diasFinal = new Date(curso[0].periodo_final);
            var horaInicial = curso[0].hora_inicial;
            var horaFinal = curso[0].hora_final;
            var diferenciaTiempo = diasFinal.getTime() - diasInicial.getTime();
            var diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);

            // Cada dia entre la fecha inicial y final del curso
            arrDias = [];
            // Cada dia entre la fecha inicial y final 
            // del curso para determinar si está presente o ausente
            arrAsistencia = [];
            // Obtiene los dias en los que el alumno ha asistido
            diasAsistidos = [];


            var periodoInicial = curso[0].periodo_inicial;
            arrDias.push(new Date(periodoInicial.setDate(periodoInicial.getDate())));
            for (let index = 0; index < diferenciaDias; index++) {
                arrDias.push(new Date(periodoInicial.setDate(periodoInicial.getDate() + 1)));
            }

            db.query('SELECT * FROM lista_asistencia WHERE grupo = ? AND rfc = ?',
                [group, decoded.id], (error, results) => {
                    if (error) {
                        return res.status(500).send({
                            message: 'Error al consultar datos de asistencia: ' + error
                        });
                    };
                    // Si no hay registro de asistencia, despliega todos los dias del curso
                    if (results.length < 1) {
                        arrDias.forEach(date => {
                            if (moment(new Date(date)).format("DD-MM-YYYY") === moment(diaActual).format("DD-MM-YYYY")
                                && moment(horaInicial).format("HH:mm") <= moment(diaActual).format("HH:mm")
                                && moment(horaFinal).format("HH:mm") >= moment(diaActual).format("HH:mm")) {
                                arrAsistencia.push({
                                    date: moment(new Date(date)).format("DD-MM-YYYY"),
                                    schedule: moment(new Date(horaInicial)).format("HH:mm")
                                        + ' - '
                                        + moment(new Date(horaFinal)).format("HH:mm"),
                                    status: '-',
                                    active: false,
                                    course: curso[0].nombre_curso,
                                });
                            } else {
                                arrAsistencia.push({
                                    date: moment(new Date(date)).format("DD-MM-YYYY"),
                                    schedule: moment(new Date(horaInicial)).format("HH:mm")
                                        + ' - '
                                        + moment(new Date(horaFinal)).format("HH:mm"),
                                    status: '-',
                                    active: true,
                                    course: curso[0].nombre_curso,
                                });
                            }
                        });
                        console.log('Dias de asistencia cargados');
                        return res.status(200).send(arrAsistencia);
                    }

                    // Inserta en un array los dias en los que el alumno ha asistido
                    for (let index = 0; index < results.length; index++) {
                        diasAsistidos.push(moment(new Date(results[index].fecha_asistencia)).format("DD-MM-YYYY"));
                    };

                    arrDias.forEach(date => {
                        // Si el alumno tiene registro de asistencia en alguno de los dias del arreglo arrDias, 
                        // entonces registrar como presente
                        if (diasAsistidos.toString().indexOf(moment(new Date(date)).format("DD-MM-YYYY")) !== -1) {

                            arrAsistencia.push({
                                date: moment(new Date(date)).format("DD-MM-YYYY"),
                                schedule: moment(new Date(horaInicial)).format("HH:mm")
                                    + ' - '
                                    + moment(new Date(horaFinal)).format("HH:mm"),
                                status: 'Presente',
                                active: true,
                                course: curso[0].nombre_curso,

                            });
                            // Si se encuentra dentro del día y horario para tomar asistencia, 
                            // entonces registrar como pendiente y activar boton para registrar asistencia
                        } else if (moment(new Date(date)).format("DD-MM-YYYY") === moment(diaActual).format("DD-MM-YYYY")
                            && moment(horaInicial).format("HH:mm") <= moment(diaActual).format("HH:mm")
                            && moment(horaFinal).format("HH:mm") >= moment(diaActual).format("HH:mm")) {

                            arrAsistencia.push({
                                date: moment(new Date(date)).format("DD-MM-YYYY"),
                                schedule: moment(new Date(horaInicial)).format("HH:mm")
                                    + ' - '
                                    + moment(new Date(horaFinal)).format("HH:mm"),
                                status: '-',
                                active: false,
                                course: curso[0].nombre_curso,

                            });
                        } else {
                            arrAsistencia.push({
                                date: moment(new Date(date)).format("DD-MM-YYYY"),
                                schedule: moment(new Date(horaInicial)).format("HH:mm")
                                    + ' - '
                                    + moment(new Date(horaFinal)).format("HH:mm"),
                                status: '-',
                                active: true,
                                course: curso[0].nombre_curso,

                            });
                        }
                    });
                    return res.status(200).send(arrAsistencia);
                });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener datos de asistencia. \nError: ' + error
        });
    }

}

var searchRecursive = function(dir, pattern) {
    // This is where we store pattern matches of all files inside the directory
    var results = [];
    
    // Read contents of directory
    fs.readdirSync(dir).forEach(function (dirInner) {
      // Obtain absolute path
      dirInner = path.resolve(dir, dirInner);
  
      // Get stats to determine if path is a directory or a file
      var stat = fs.statSync(dirInner);
  
      // If path is a directory, scan it and combine results
      if (stat.isDirectory()) {
        results = results.concat(searchRecursive(dirInner, pattern));
      }
  
      // If path is a file and ends with pattern then push it onto results
      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner);
      }
    });
  
    return results;
  };