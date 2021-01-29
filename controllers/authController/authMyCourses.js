const db = require('../../db');
var moment = require('moment');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
var fs = require('fs');
var path = require('path');



exports.setAttendance = async (req, res) => {

    try {
        const { todaysDate } = req.body;
        const group = req.params.tagId;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);


        db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, results) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar datos de asistencia: ' + error
                });
            };
            var horaInicial = results[0].hora_inicial;
            var horaFinal = results[0].hora_final;
            var diaActual = new Date();

            // // Ajuste a la hora actual
            // diaActual.setHours(diaActual.getHours() - 7);

            // // Compara dias
            // console.log(moment(diaActual).format("DD-MM-YYYY"))        
            // console.log(todaysDate)  

            // // Compara horas
            // console.log(moment(horaInicial).format("HH:mm"));
            // console.log(moment(horaFinal).format("HH:mm"));
            // console.log(moment(diaActual).format("HH:mm"));

            // console.log(todaysDate);
            // console.log(moment(diaActual).format("DD-MM-YYYY"));

            //Si la fecha de asistencia es igual al dia actual...
            if (todaysDate === moment(diaActual).format("DD-MM-YYYY")) {
                //Reajusta horas
                // diaActual.setHours(diaActual.getHours() + 7);
                // Si la hora actual está dentro del horario....


                console.log(moment(horaInicial).format("HH:mm"));
                console.log(moment(horaFinal).format("HH:mm"));
                console.log(moment(diaActual).format("HH:mm"));



                if (moment(horaInicial).format("HH:mm") <= moment(diaActual).format("HH:mm")
                    && moment(horaFinal).format("HH:mm") >= moment(diaActual).format("HH:mm")) {
                    diaActual.setHours(diaActual.getHours() - 7);
                    // Registrar asistencia
                    db.query('INSERT INTO lista_asistencia SET ?', {
                        rfc: decoded.id,
                        grupo: group,
                        fecha_asistencia: diaActual
                    }, (error, results) => {
                        if (error) {
                            return res.status(500).send({
                                message: 'Error con al registrar asistencia' + error
                            });
                        } else {
                            console.log('Asistencia registrada')
                            return res.status(201).send('Asistencia registrada');
                        }
                    });

                } else {
                    console.log('Aun no es hora')
                    return res.status(401).send({
                        message: 'Aún no es hora para registrar asistencia'
                    });
                }
            } else {
                console.log('Aun no es dia')
                return res.status(401).send({
                    message: 'Aún no es día para registrar asistencia'
                });
            }



        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al registrar asistencia. \nError: ' + error
        });
    }
}

exports.unsubscribeCourse = async (req, res, next) => {

    try {
        const group = req.params.tagId;
        const { password } = req.body;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);


        db.query('SELECT contrasena FROM usuario WHERE rfc = ?', [decoded.id], async (error, results) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al identificar usuario: ' + error
                });
            };
            // si el ID no existe o si la contraseña no es correcta...
            if (results.length < 1 || !(await bcryptjs.compare(password, results[0].contrasena))) {
                // 401 es estado para PROHIBIDO
                console.log('Usuario o contraseña incorrectos');
                return res.status(401).send({
                    message: 'Usuario o contraseña incorrectos'
                });
            } else {
                db.query('SELECT * FROM curso, usuario WHERE grupo = ? AND usuario.rfc = ?', [group, decoded.id], (error, curso) => {
                    var fecha = new Date();
                    fecha.setHours(fecha.getHours() - 7);
                    // Si el curso ha finalizado...
                    if (curso[0].periodo_inicial < fecha && curso[0].periodo_final < fecha) {
                        return res.status(401).send({
                            message: 'No se puede desinscribir porque el curso ha finalizado.'
                        });
                    }
                    // Eliminar de tabla de inscritos
                    db.query('DELETE FROM cedula_inscripcion WHERE grupo = ? AND rfc = ?', [group, decoded.id], (error, result) => {
                        if (error) {
                            return res.status(500).send({
                                message: 'Error al desinscribirse del curso: ' + error
                            });
                        } else {
                            console.log('Desinscrito');
                        }
                        // Eliminar de tabla de asistencia
                        db.query('DELETE FROM lista_asistencia WHERE grupo = ? AND rfc = ?', [group, decoded.id], (error, result) => {

                            if (error) {
                                return res.status(500).send({
                                    message: 'Error al desinscribirse del curso: ' + error
                                });
                            } else {
                                console.log('Asistencia eliminada');

                            };
                            // Eliminar de tabla de calificaciones
                            db.query('DELETE FROM calificaciones WHERE grupo = ? AND rfc = ?', [group, decoded.id], (error, result) => {
                                if (error) {
                                    return res.status(500).send({
                                        message: 'Error al desinscribirse del curso: ' + error
                                    });
                                } else {
                                    console.log('Eliminado de lista de calificaciones');
                                    return res.status(200).send({
                                        message: 'Desinscrito exitosamente'
                                    });
                                };
                            });
                        });
                    });
                });
            }
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al dar de baja curso. \nError: ' + error
        });
    }
}

exports.downloadCedula = async (req, res) => {
    try {
        const group = req.params.tagId;
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        //var pathCedula = __dirname + '/Documentos/cedulas/CEDULA DE INSCRIPCION- ' + decoded.id + ' - ' + group + '.docx'
        var files = searchRecursive(__dirname + '/Documentos/cedulas', 'CEDULA DE INSCRIPCION- ' + decoded.id + ' - ' + group + '.docx');
        console.log(files[0])
        return res.download(files[0], function (err) {
            if (err) {
                // if the file download fails, we throw an error
                console.log(err);
                res.status(400).send({
                    message: 'Error al descargar cedula de inscripción'
                });
            };
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al descargar cedula'
        });
    }
}

exports.sendFileName = async (req, res) => {
    try {
        const group = req.params.tagId;
        console.log(group);
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        var fileName = 'CEDULA DE INSCRIPCION-' + decoded.id + '-' + group + '.docx'
        

        var data = {
            fileName: fileName
        };
        return res.status(200).send(data);

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al descargar cedula sendfilename'
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