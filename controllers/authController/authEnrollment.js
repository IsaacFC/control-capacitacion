const db = require('../../db');
var moment = require('moment');

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

exports.enrollStudent = async (req, res, next) => {
    try {

        const {
            rfc, group, studies, collegeCareer, positionType, positionLevel,
            responsibleUnit, area, actualPosition, immediateBoss, address,
            phoneNumber, schedule
        } = req.body;


        // obtener registro de inscripcion
        db.query('SELECT * FROM cedula_inscripcion WHERE rfc = ? AND grupo = ?', [rfc, group], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al buscar usuario: ' + error
                });
            };
            if (result.length > 0) {
                console.log('Ya te has inscrito a este curso');
                return res.status(409).send({
                    message: 'No es posible inscribirse. Ya se encuentra inscrito a este curso.'
                });
            };
            db.query('SELECT * FROM cedula_inscripcion WHERE rfc = ?', [rfc], (error, cursosInscritos) => {

                //obtener limite de participantes
                db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, result) => {
                    var limiteParticipantes = result[0].limite_participantes;

                    if (cursosInscritos.length > 0) {
                        // Compara cada fila para determinar si hay empalme de horario
                        Object.keys(cursosInscritos).forEach(function (key) {
                            console.log(cursosInscritos[key].grupo)
                            db.query('SELECT * FROM curso WHERE grupo = ?', [cursosInscritos[key].grupo], (error, horario) => {
                                console.log('Cursos inscritos: ')
                                console.log(moment(new Date(horario[0].hora_inicial)).format("HH:mm"))
                                console.log(moment(new Date(horario[0].hora_final)).format("HH:mm"))
                                console.log('Este curso: ')
                                console.log(moment(new Date(result[0].hora_inicial)).format("HH:mm") )
                                console.log(moment(new Date(result[0].hora_final)).format("HH:mm"))
                                if ((new Date(result[0].periodo_inicial) <= new Date(horario[0].periodo_final))
                                    && (new Date(horario[0].periodo_inicial) <= new Date(result[0].periodo_final))) {
                                    if ((moment(new Date(horario[0].hora_inicial)).format("HH:mm") < moment(new Date(result[0].hora_final)).format("HH:mm"))
                                        && (moment(new Date(result[0].hora_inicial)).format("HH:mm") < moment(new Date(horario[0].hora_final)).format("HH:mm"))) {
                                        // Indica que hay empalme
                                        console.log('Hay empalme')
                                        isOverlapped();
                                        return;
                                    };
                                };
                            });
                        });
                    };

                    // Contar numero de participantes que están inscritos al curso
                    db.query('SELECT COUNT(*) AS total FROM cedula_inscripcion WHERE grupo = ?', [group], (error, result) => {
                        var numeroInscritos = result[0].total;

                        // Si hay empalme, entonces manda mensaje al cliente
                        if (alertLap() === 1) {
                            console.log('Reiniciar laps')
                            notOverlapped();
                            return res.status(409).send({
                                message: 'No se puede inscribir porque el curso tendría empalme de horas con otro(s) curso(s).'
                            });
                        };
                        if (numeroInscritos < limiteParticipantes) {
                            //Insertar a tabla de inscritos
                            db.query('INSERT INTO cedula_inscripcion SET ?', {
                                rfc: rfc,
                                grupo: group,
                                fecha_inscrito: new Date(),
                                estudios: studies,
                                carrera_cursada: collegeCareer,
                                tipo_puesto: positionType,
                                nivel_puesto: positionLevel,
                                unidad_responsable: responsibleUnit,
                                area: area,
                                posicion_actual: actualPosition,
                                jefe_inmediato: immediateBoss,
                                domicilio_oficial: address,
                                telefono_oficial: phoneNumber,
                                horario: schedule,
                            }, (error, results) => {
                                // si la llave primaria está en la BD... entonces despliega error
                                if (error) {
                                    return res.status(500).send({
                                        message: 'al inscribir usuario 617' + error
                                    });
                                } else {
                                    // Insertar a lista de calificaciones
                                    db.query('INSERT INTO calificaciones SET ?', {
                                        rfc: rfc,
                                        grupo: group,
                                    }, (error, results) => {
                                        if (error) {
                                            return res.status(500).send({
                                                message: 'al registrar a lista de calificaciones' + error
                                            });
                                        } else {
                                            console.log('Inscrito correctamente');
                                            next();
                                        };
                                    });
                                };
                            });
                        } else {
                            console.log('El grupo ha excedido su límite de participantes.');
                            return res.status(401).send({
                                message: 'El grupo ha excedido su límite de participantes.'
                            });
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al inscribir usuario. \nError: ' + error
        });
    }

}

