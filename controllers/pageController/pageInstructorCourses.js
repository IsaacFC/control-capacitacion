const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../../db');
var moment = require('moment');

var arrDias = [];

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

exports.getInstructorCourses = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        //console.log(decoded.id);

        // Selecciona todos los cursos que imparte el usuario
        db.query('SELECT * FROM curso WHERE rfc = ?', [decoded.id], (error, cursosInstructor) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar los cursos del instructor: ' + error
                });
            };
            let arrCursosInstructor = [];
            var data = {};

            if (cursosInstructor.length < 1) {
                return res.status(200).send(cursosInstructor);
            };

            

            Object.keys(cursosInstructor).forEach(function (key) {
                var row = cursosInstructor[key];
                var fecha = new Date();
                fecha.setHours(fecha.getHours() - 7);

                if (row.periodo_inicial > fecha && row.periodo_final > fecha) {
                    var status = 'Por cursar'
                }
                if (row.periodo_inicial < fecha && row.periodo_final > fecha) {
                    var status = 'En curso'
                }
                if (row.periodo_inicial < fecha && row.periodo_final < fecha) {
                    var status = 'Finalizado'
                }
                data = {
                    course: row.nombre_curso,
                    group: row.grupo,
                    classroom: row.aula,
                    period: moment(new Date(row.periodo_inicial)).format("DD-MM-YYYY")
                        + ' al '
                        + moment(new Date(row.periodo_final)).format("DD-MM-YYYY")
                        + '\n Horario: ' + moment(new Date(row.hora_inicial)).format("HH:mm")
                        + ' - '
                        + moment(new Date(row.hora_final)).format("HH:mm"),
                    status: status,
                    department: row.departamento,
                    trainingType: row.tipo_capacitacion,
                };
                arrCursosInstructor.push(data);
                
                if ((cursosInstructor.length - 1) == key) {
                    console.log('Cursos instructor cargados');
                    return res.status(200).send(arrCursosInstructor);
                }
            });
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener cursos del instructor. \nError: ' + error
        });
    }
}

exports.getAttendanceInstructorInfo = async (req, res) => {
    try {
        const group = req.params.tagId;

        db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, cursos) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar datos del grupo (asistencia): ' + error
                });
            };
            if (cursos.length < 1) {
                return res.status(404).send({
                    message: 'Pagina no encontrada'
                });
            };

            // Obtiene el numero de dias entre la fecha inicial y final del curso
            var diaActual = new Date();
            var diaInicial = new Date(cursos[0].periodo_inicial);
            var diaFinal = new Date(cursos[0].periodo_final);
            var horaInicial = cursos[0].hora_inicial;
            var horaFinal = cursos[0].hora_final;
            var diferenciaTiempo = diaFinal.getTime() - diaInicial.getTime();
            var diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);

            // Cada dia entre la fecha inicial y final del curso
            arrDias = [];
            var resArray = [];

            var periodoInicial = cursos[0].periodo_inicial;
            arrDias.push(new Date(periodoInicial.setDate(periodoInicial.getDate())));
            for (let index = 0; index < diferenciaDias; index++) {
                arrDias.push(new Date(periodoInicial.setDate(periodoInicial.getDate() + 1)));
            };
            // Sumar dos dias a la fecha final del curso
            diaFinal.setDate(diaFinal.getDate() + 2);
            // Ajuste de horas 
            diaActual.setHours(diaActual.getHours() - 7);

            arrDias.forEach(date => {
                // Si el curso no ha finalizado...
                if (diaActual < diaFinal) {
                    var data = {
                        date: moment(new Date(date)).format("DD-MM-YYYY"),
                        schedule: moment(horaInicial).format("HH:mm")
                            + ' - ' +
                            moment(horaFinal).format("HH:mm"),
                        active: false,
                        course: cursos[0].nombre_curso,
                    };
                    //console.log(cursos[0].nombre_curso)
                    resArray.push(data);
                } else {
                    var data = {
                        date: moment(new Date(date)).format("DD-MM-YYYY"),
                        schedule: moment(horaInicial).format("HH:mm")
                            + ' - ' +
                            moment(horaFinal).format("HH:mm"),
                        active: true,
                        course: cursos[0].nombre_curso,

                    };
                    resArray.push(data);
                };

            });
            console.log('Lista de asistencia para el instructor cargada')
            return res.status(200).send(resArray);

        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener datos de asistencia. \nError: ' + error
        });
    }

}

exports.getPartakersList = async (req, res) => {
    try {
        const group = req.params.tagId;
        var arrRFC = [];
        var arrUsuarios = [];

        console.log(group)

        db.query('SELECT * FROM cedula_inscripcion WHERE grupo = ?', [group], (error, inscritos) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar lista de inscritos: ' + error
                });
            };

            if (inscritos.length < 1) {
                return res.status(200).send(inscritos);
            };
            // Inserta en un arreglo el RFC de cada usuario inscrito
            Object.keys(inscritos).forEach(function (key) {
                var row = inscritos[key];
                arrRFC.push(row.rfc);
                if ((inscritos.length - 1) == key) {
                    console.log('RFC cargados');
                }
            });
            Object.keys(arrRFC).forEach(function (key) {
                var rfc = arrRFC[key];

                db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, usuario) => {
                    
                    var data = {
                        course: group,
                        name: usuario[0].nombre_usuario
                            + ' ' + usuario[0].apellido_paterno
                            + ' ' + usuario[0].apellido_materno,
                        email: usuario[0].email,
                    };
                    arrUsuarios.push(data);
                    console.log(data)

                    if ((arrRFC.length - 1) == key) {
                        console.log('Lista de inscritos cargada');
                        return res.status(200).send(arrUsuarios);
                    }
                });
            });


        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener lista de inscritos. \nError: ' + error
        });
    }
}

exports.getGroupAttendanceList = async (req, res) => {
    try {
        const group = req.params.group;
        const date = req.params.date;
        
        var arrRFC = [];
        var arrUsuarios = [];
        db.query('SELECT * FROM cedula_inscripcion WHERE grupo = ?', [group], (error, inscritos) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar lista de inscritos: ' + error
                });
            };

            if (inscritos.length < 1) {
                return res.status(200).send(inscritos);
            };

            // Inserta en un arreglo el RFC de cada usuario inscrito
            Object.keys(inscritos).forEach(function (key) {
                var row = inscritos[key];
                arrRFC.push(row.rfc);

                if ((inscritos.length - 1) == key) {
                    console.log('RFC cargados');
                }
            });
            Object.keys(arrRFC).forEach(function (key) {
                var rfc = arrRFC[key];

                db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, usuario) => {

                    var nombreUsuario = usuario[0].nombre_usuario;
                    var apellidoPaterno = usuario[0].apellido_paterno;
                    var apellidoMaterno = usuario[0].apellido_materno;
                    var fecha = moment(new Date(date)).format('YYYY-DD-MM');

                    db.query('SELECT * FROM lista_asistencia WHERE rfc = ? AND grupo = ? AND fecha_asistencia = ?',
                        [rfc, group, fecha.toString()], (error, asistencia) => {

                            if (asistencia.length < 1) {
                                var data = {
                                    name: nombreUsuario
                                        + ' ' + apellidoPaterno
                                        + ' ' + apellidoMaterno,
                                    status: '—',
                                    rfc: rfc,
                                };
                                arrUsuarios.push(data);
                            } else {
                                var data = {
                                    name: nombreUsuario
                                        + ' ' + apellidoPaterno
                                        + ' ' + apellidoMaterno,
                                    status: 'Presente',
                                    rfc: rfc,
                                };
                                arrUsuarios.push(data);
                            }
                            if ((arrRFC.length - 1) == key) {
                                console.log('Lista de inscritos cargada');
                                return res.status(200).send(arrUsuarios);
                            }
                        });
                });
            });


        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener lista de asistencia. \nError: ' + error
        });
    }
}

exports.getGradesList = async (req, res) => {
    try {
        const group = req.params.grupo;
        var arrRFC = [];
        var resArray = [];

        // var data = {
        //     name: 'a',
        //     status: 'b',
        //     grade: 'c',
        //     active: 'd',
        //     rfc: 'e'
        // }
        // resArray.push(data);
        // return res.send(resArray);

        db.query('SELECT * FROM calificaciones WHERE grupo = ?', [group], (error, calificaciones) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar lista de inscritos: ' + error
                });
            };

            if (calificaciones.length < 1) {
                return res.status(200).send(calificaciones);
            };

            // Inserta en un arreglo el RFC de cada usuario inscrito
            Object.keys(calificaciones).forEach(function (key) {
                var row = calificaciones[key];
                arrRFC.push(row.rfc);

                if ((calificaciones.length - 1) == key) {
                    console.log('RFC cargados');
                }
            });
            Object.keys(arrRFC).forEach(function (key) {
                var rfc = arrRFC[key];

                db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, usuario) => {

                    var nombreUsuario = usuario[0].nombre_usuario;
                    var apellidoPaterno = usuario[0].apellido_paterno;
                    var apellidoMaterno = usuario[0].apellido_materno;
                    console.log(calificaciones[0].calificacion)
                    var data = {
                        name: nombreUsuario
                            + ' ' + apellidoPaterno
                            + ' ' + apellidoMaterno,
                        grade: calificaciones[0].calificacion,
                        status: calificaciones[0].estado,
                        rfc: usuario[0].rfc,
                    };
                    resArray.push(data);

                    if ((arrRFC.length - 1) == key) {
                        console.log('Lista de inscritos cargada');
                        return res.status(200).send(resArray);
                    }
                });
            });


        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al obtener lista de asistencia. \nError: ' + error
        });
    }
}