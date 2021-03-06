const db = require('../../db');
var moment = require('moment');




exports.updatePartakerAttendance = async (req, res, next) => {

    var rfc = req.params.rfc;
    var group = req.params.grupo;
    var { status } = req.body;

    var param = req.params.fecha.replace(/-/g, '/');
    console.log(param);
    var fecha = moment(param, "DD-MM-YYYY");
    var dateObject = fecha.toDate();

    var fechaAsistencia = moment(new Date(dateObject)).format('YYYY-MM-DD');

    console.log(status)
    console.log(fechaAsistencia.toString())
    console.log(req.params.fecha)

    try {
        db.query('SELECT * FROM lista_asistencia WHERE rfc = ? AND grupo = ? AND fecha_asistencia = ?',
            [rfc, group, fechaAsistencia.toString()], (error, asistencia) => {

                if (status === 'P' && asistencia.length < 1) {
                    db.query('INSERT INTO lista_asistencia SET ?', {
                        rfc: rfc,
                        grupo: group,
                        fecha_asistencia: fechaAsistencia.toString()
                    }, (error, results) => {
                        if (error) {
                            console.log(error);

                        } else {
                            console.log('Asistencia registrada')
                        }
                    });
                } else if (status === 'A' && asistencia.length > 0) {
                    db.query('DELETE FROM lista_asistencia WHERE rfc = ? AND grupo = ? AND fecha_asistencia = ?',
                        [rfc, group, fechaAsistencia.toString()], (error, results) => {
                            if (error) {
                                console.log(error);

                            } else {
                                console.log('Asistencia eliminada');
                            };
                        });
                }
                return res.status(201).send('Asistencia registrada');

            });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al registrar asistencia al alumno. \nError: ' + error
        });
    }

}

exports.setGrades = async (req, res, next) => {
   

    try {
        var rfc = req.params.rfc;
        var group = req.params.grupo;
    
        var { status, grade } = req.body;
    
        console.log(rfc);
        console.log(group);
        console.log(grade);
        console.log(status);

        db.query('UPDATE calificaciones SET calificacion = ?, ' +
            ' estado = ? ' +
            ' WHERE grupo = ? AND rfc = ?',
            [grade, status, group, rfc], async (error, results) => {

                if (error) {
                    console.log(error);

                    return res.status(500).send({
                        message: 'Error al modificar curso' + error
                    });
                } else {
                    console.log('Calificacion asignada');
                    return res.status(201).send('Calificacion asignada');
                }
            });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al calificar al alumno. \nError: ' + error
        });
    }
}




exports.downloadAttendanceList = async (req, res, next) => {
   

    try {
        

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al calificar al alumno. \nError: ' + error
        });
    }
}

