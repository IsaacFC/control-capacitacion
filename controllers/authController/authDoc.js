const db = require('../../db');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

let resArray = [];
var fechaActual = new Date();


function getMonthName(date) {
    switch (date) {
        case 0:
            return 'Enero';
        case 1:
            return 'Febrero';
        case 2:
            return 'Marzo';
        case 3:
            return 'Abril:';
        case 4:
            return 'Mayo';
        case 5:
            return 'Junio';
        case 6:
            return 'Julio:';
        case 7:
            return 'Agosto:';
        case 8:
            return 'Septiembre';
        case 9:
            return 'Octubre';
        case 10:
            return 'Noviembre';
        case 11:
            return 'Diciembre:';
    };
};

//prueba
exports.getCedulaInscripcion = async (req, res) => {
    try {
        const {
            rfc, group, studies, collegeCareer, positionType, positionLevel,
            responsibleUnit, area, actualPosition, immediateBoss, address,
            phoneNumber, schedule
        } = req.body;

        db.query('SELECT * FROM usuario, curso WHERE usuario.rfc = ? AND curso.grupo = ?', [rfc, group], async (error, results) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al buscar usuario' + error
                });
            }

            var content = fs.readFileSync(path.resolve(__dirname, 'index_cedula.docx'), 'binary');
            var zip = new PizZip(content);
            var doc = new Docxtemplater(zip);
            var date = new Date(Date.now());

            doc.setData({
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                firstLastName: results[0].apellido_paterno,
                secondLastName: results[0].apellido_materno,
                name: results[0].nombre_usuario,
                rfc: rfc,
                phone_number: results[0].telefono,
                email: results[0].email,
                // ◉ ◎ ○ ● 〇 ⬤
                studies: studies + ' ⬤',
                collegeCareer: collegeCareer,
                positionType: positionType + ' ⬤',
                positionLevel: positionLevel + ' ⬤',
                responsibleUnit: responsibleUnit,
                area: area,
                actualPosition: actualPosition,
                immediateBoss: immediateBoss,
                address: address,
                phoneNumber: phoneNumber,
                schedule: schedule,
                course: results[0].nombre_curso,
                instructor: results[0].nombre_instructor,
                period: moment(new Date(results[0].periodo_inicial)).format("DD-MM-YYYY")
                    + ' al '
                    + moment(new Date(results[0].periodo_final)).format("DD-MM-YYYY"),
                courseSchedule: moment(new Date(results[0].hora_inicial)).format("HH:mm")
                    + ' - '
                    + moment(new Date(results[0].hora_final)).format("HH:mm"),
                sede: 'TecNM Campus Hermosillo',
            });

            doc.render();

            var buf = doc.getZip()
                .generate({ type: 'nodebuffer' });

            var anio = new Date().getFullYear();
            var mes = getMonthName(new Date().getMonth());

            var direccionAnio = 'Documentos/cedulas/' + anio + '/';

            if (!fs.existsSync(path.resolve(__dirname, direccionAnio))) {
                fs.mkdirSync(path.resolve(__dirname, direccionAnio));
            }
            var direccionMes = direccionAnio + '/' + mes;

            if (!fs.existsSync(path.resolve(__dirname, direccionMes))) {
                fs.mkdirSync(path.resolve(__dirname, direccionMes));
            }

            // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
            fs.writeFileSync(path.resolve(__dirname, direccionMes + '/CEDULA DE INSCRIPCION- ' + rfc + ' - ' + group + '.docx'), buf);

            return res.status(201).send({
                message: 'Inscrito correctamente'
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(401).send('Error');
    }
}

exports.fillEvaluacionDocente = async (req, res) => {
    try {
        // Obtiene RFC del usuario que inicia sesion por medio de Cookies
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        const group = req.params.tagId;

        const {
            course, responsibleUnit, instructor, campus,
            courseDate, hours, courseSchedule,
            question1D, question1I, question2D, question2I, question3D, question3I,
            question4D, question4I, question5D, question5I, question6D, question6I,
            question7D, question7I, question8D, question8I, question9D, question9I,
            question10D, question10I, question11D, question11I, question12D, question12I,
            question13aD, question13aI, question13bD, question13bI, question13cD, question13cI,
            question14D, question14I, question15D, question15I, question16D, question16I,
            question17D, question17I, question18D, question18I, question19D, question19I,
            question20Input, commentaries } = req.body;
        var { question20a, question20b, question20c } = req.body;
        var date = new Date(Date.now());

        var content = fs.readFileSync(path.resolve(__dirname, 'index_evaluacion.docx'), 'binary');
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip);
        if (question20a) {
            question20a = 'X';
        } else {
            question20a = '';
        }
        if (question20b) {
            question20b = 'X';
        } else {
            question20b = '';
        }
        if (question20c) {
            question20c = 'X';
        } else {
            question20c = '';
        }
        doc.setData({
            course: course,
            responsibleUnit: responsibleUnit,
            instructor: instructor,
            campus: campus,
            courseDate: courseDate,
            hours: hours,
            courseSchedule: courseSchedule,
            question1D: question1D,
            question1I: question1I,
            question2D: question2D,
            question2I: question2I,
            question3D: question3D,
            question3I: question3I,
            question4D: question4D,
            question4I: question4I,
            question5D: question5D,
            question5I: question5I,
            question6D: question6D,
            question6I: question6I,
            question7D: question7D,
            question7I: question7I,
            question8D: question8D,
            question8I: question8I,
            question9D: question9D,
            question9I: question9I,
            question10D: question10D,
            question10I: question10I,
            question11D: question11D,
            question11I: question11I,
            question12D: question12D,
            question12I: question12I,
            question13aD: question13aD,
            question13aI: question13aI,
            question13bD: question13bD,
            question13bI: question13bI,
            question13cD: question13cD,
            question13cI: question13cI,
            question14D: question14D,
            question14I: question14I,
            question15D: question15D,
            question15I: question15I,
            question16D: question16D,
            question16I: question16I,
            question17D: question17D,
            question17I: question17I,
            question18D: question18D,
            question18I: question18I,
            question19D: question19D,
            question19I: question19I,
            question20a: question20a,
            question20b: question20b,
            question20c: question20c,
            question20Input: question20Input,
            commentaries: commentaries,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        });

        doc.render();

        var buf = doc.getZip()
            .generate({ type: 'nodebuffer' });

        var anio = new Date().getFullYear();
        var mes = getMonthName(new Date().getMonth());

        var direccionAnio = 'Documentos/evaluaciones/' + anio + '/';

        if (!fs.existsSync(path.resolve(__dirname, direccionAnio))) {
            fs.mkdirSync(path.resolve(__dirname, direccionAnio));
        }
        var direccionMes = direccionAnio + '/' + mes;

        if (!fs.existsSync(path.resolve(__dirname, direccionMes))) {
            fs.mkdirSync(path.resolve(__dirname, direccionMes));
        }
        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(path.resolve(__dirname, direccionMes + '/ENCUESTA-' + decoded.id + ' - ' + group + '.docx'), buf);

        return res.status(200).send({
            message: 'Evaluación realizada con éxito.'
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al evaluar docente. \nError: ' + error
        });
    }
}



exports.downloadAttendanceList = async (req, res) => {

    try {

    } catch (error) {
        console.log('SERVIDOR: ' + error);
        return res.status(500).send({
            message: error
        });
    }
}
exports.sendFileName = (req, res) => {
    try {

        var content = fs.readFileSync(path.resolve(__dirname, 'index_asistencia.docx'), 'binary');
        var zip = new PizZip(content);

        var doc = new Docxtemplater(zip, {
            linebreaks: true,
            nullGetter: function () {
                return "";
            }
        });

        const group = req.params.group;

        db.query(`SELECT  *, usuario.apellido_paterno, usuario.apellido_materno, usuario.nombre_usuario,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 0
        then 1 END) AS CHAR) AS Mon,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 1
        then 1 END) AS CHAR) AS Tue,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 2
        then 1 END) AS CHAR) AS Wed,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 3
        then 1 END) AS CHAR) AS Thu,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 4
        then 1 END) AS  CHAR) AS Fri,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 5
        then 1 END) AS  CHAR) AS Sat,
        cast(COUNT(CASE WHEN weekday(date(lista_asistencia.fecha_asistencia)) = 6
        then 1 END) AS  CHAR) AS Sun
        FROM cedula_inscripcion
        INNER JOIN curso ON curso.grupo = cedula_inscripcion.grupo  
        INNER JOIN usuario ON usuario.rfc = cedula_inscripcion.rfc
        INNER JOIN lista_asistencia ON lista_asistencia.rfc = cedula_inscripcion.rfc  
        WHERE cedula_inscripcion.grupo = '${group}' 
        GROUP BY usuario.apellido_paterno`, (error, inscrito) => {
            if (error) {
                console.log(error)
            };



            db.query('SELECT * FROM curso WHERE grupo = ?', [group], (error, curso) => {

                if (error) {
                    return res.status(500).send({
                        message: 'Error al consultar curso (descargar lista de asistencia): ' + error
                    });
                };

                for (let index = 0; index < 30; index++) {
                    inscrito.push("");
                }
                var arr = [];


                arr.push({
                    curso: curso[0].nombre_curso,
                    instructor: curso[0].nombre_instructor,
                    duracion: curso[0].num_horas + ' hrs.',
                    horario: moment(new Date(curso[0].hora_inicial)).format("HH:mm")
                        + ' - '
                        + moment(new Date(curso[0].hora_final)).format("HH:mm"),
                    periodo: moment(new Date(curso[0].periodo_inicial)).format("DD-MM-YYYY")
                        + ' al '
                        + moment(new Date(curso[0].periodo_final)).format("DD-MM-YYYY"),
                    plantel: 'Hermosillo',
                    sede: 'TecNM Campus Hermosillo',

                    nombre1: inscrito[0].apellido_paterno + ' ' +
                        inscrito[0].apellido_materno + ' ' +
                        inscrito[0].nombre_usuario,
                    area1: inscrito[0].area,
                    rfc1: inscrito[0].rfc,
                    genero1: inscrito[0].genero,
                    plaza1: inscrito[0].plaza,
                    tipo1: inscrito[0].tipo_puesto,
                    nivel1: inscrito[0].nivel_puesto,
                    L1: inscrito[0].Mon, Ma1: inscrito[0].Tue, Mi1: inscrito[0].Wed,
                    J1: inscrito[0].Thu, V1: inscrito[0].Fri, S1: inscrito[0].Sat,

                    nombre2: inscrito[1].apellido_paterno + ' ' +
                        inscrito[1].apellido_materno + ' ' +
                        inscrito[1].nombre_usuario,
                    area2: inscrito[1].area,
                    rfc2: inscrito[1].rfc,
                    genero2: inscrito[1].genero,
                    plaza2: inscrito[1].plaza,
                    tipo2: inscrito[1].tipo_puesto,
                    nivel2: inscrito[1].nivel_puesto,
                    L2: inscrito[1].Mon, Ma2: inscrito[1].Tue, Mi2: inscrito[1].Wed,
                    J2: inscrito[1].Thu, V2: inscrito[1].Fri, S2: inscrito[1].Sat,

                    nombre3: inscrito[2].apellido_paterno + ' ' +
                        inscrito[2].apellido_materno + ' ' +
                        inscrito[2].nombre_usuario,
                    area3: inscrito[2].area,
                    rfc3: inscrito[2].rfc,
                    genero3: inscrito[2].genero,
                    plaza3: inscrito[2].plaza,
                    tipo3: inscrito[2].tipo_puesto,
                    nivel3: inscrito[2].nivel_puesto,
                    L3: inscrito[2].Mon, Ma3: inscrito[2].Tue, Mi3: inscrito[2].Wed,
                    J3: inscrito[2].Thu, V3: inscrito[2].Fri, S3: inscrito[2].Sat,

                    nombre4: inscrito[3].apellido_paterno + ' ' +
                        inscrito[3].apellido_materno + ' ' +
                        inscrito[3].nombre_usuario,
                    area4: inscrito[3].area,
                    rfc4: inscrito[3].rfc,
                    genero4: inscrito[3].genero,
                    plaza4: inscrito[3].plaza,
                    tipo4: inscrito[3].tipo_puesto,
                    nivel4: inscrito[3].nivel_puesto,
                    L4: inscrito[3].Mon, Ma4: inscrito[3].Tue, Mi4: inscrito[3].Wed,
                    J4: inscrito[3].Thu, V4: inscrito[3].Fri, S4: inscrito[3].Sat,

                    nombre5: inscrito[4].apellido_paterno + ' ' +
                        inscrito[4].apellido_materno + ' ' +
                        inscrito[4].nombre_usuario,
                    area5: inscrito[4].area,
                    rfc5: inscrito[4].rfc,
                    genero5: inscrito[4].genero,
                    plaza5: inscrito[4].plaza,
                    tipo5: inscrito[4].tipo_puesto,
                    nivel5: inscrito[4].nivel_puesto,
                    L5: inscrito[4].Mon, Ma5: inscrito[4].Tue, Mi5: inscrito[4].Wed,
                    J5: inscrito[4].Thu, V5: inscrito[4].Fri, S5: inscrito[4].Sat,

                    nombre6: inscrito[5].apellido_paterno + ' ' +
                        inscrito[5].apellido_materno + ' ' +
                        inscrito[5].nombre_usuario,
                    area6: inscrito[5].area,
                    rfc6: inscrito[5].rfc,
                    genero6: inscrito[5].genero,
                    plaza6: inscrito[5].plaza,
                    tipo6: inscrito[5].tipo_puesto,
                    nivel6: inscrito[5].nivel_puesto,
                    L6: inscrito[5].Mon, Ma6: inscrito[5].Tue, Mi6: inscrito[5].Wed,
                    J6: inscrito[5].Thu, V6: inscrito[5].Fri, S6: inscrito[5].Sat,

                    nombre7: inscrito[6].apellido_paterno + ' ' +
                        inscrito[6].apellido_materno + ' ' +
                        inscrito[6].nombre_usuario,
                    area7: inscrito[6].area,
                    rfc7: inscrito[6].rfc,
                    genero7: inscrito[6].genero,
                    plaza7: inscrito[6].plaza,
                    tipo7: inscrito[6].tipo_puesto,
                    nivel7: inscrito[6].nivel_puesto,
                    L7: inscrito[6].Mon, Ma7: inscrito[6].Tue, Mi7: inscrito[6].Wed,
                    J7: inscrito[6].Thu, V7: inscrito[6].Fri, S7: inscrito[6].Sat,

                    nombre8: inscrito[7].apellido_paterno + ' ' +
                        inscrito[7].apellido_materno + ' ' +
                        inscrito[7].nombre_usuario,
                    area8: inscrito[7].area,
                    rfc8: inscrito[7].rfc,
                    genero8: inscrito[7].genero,
                    plaza8: inscrito[7].plaza,
                    tipo8: inscrito[7].tipo_puesto,
                    nivel8: inscrito[7].nivel_puesto,
                    L8: inscrito[7].Mon, Ma8: inscrito[7].Tue, Mi8: inscrito[7].Wed,
                    J8: inscrito[7].Thu, V8: inscrito[7].Fri, S8: inscrito[7].Sat,

                    nombre9: inscrito[8].apellido_paterno + ' ' +
                        inscrito[8].apellido_materno + ' ' +
                        inscrito[8].nombre_usuario,
                    area9: inscrito[8].area,
                    rfc9: inscrito[8].rfc,
                    genero9: inscrito[8].genero,
                    plaza9: inscrito[8].plaza,
                    tipo9: inscrito[8].tipo_puesto,
                    nivel9: inscrito[8].nivel_puesto,
                    L9: inscrito[8].Mon, Ma9: inscrito[8].Tue, Mi9: inscrito[8].Wed,
                    J9: inscrito[8].Thu, V9: inscrito[8].Fri, S9: inscrito[8].Sat,

                    nombre10: inscrito[9].apellido_paterno + ' ' +
                        inscrito[9].apellido_materno + ' ' +
                        inscrito[9].nombre_usuario,
                    area10: inscrito[9].area,
                    rfc10: inscrito[9].rfc,
                    genero10: inscrito[9].genero,
                    plaza10: inscrito[9].plaza,
                    tipo10: inscrito[9].tipo_puesto,
                    nivel10: inscrito[9].nivel_puesto,
                    L10: inscrito[9].Mon, Ma10: inscrito[9].Tue, Mi10: inscrito[9].Wed,
                    J10: inscrito[9].Thu, V10: inscrito[9].Fri, S10: inscrito[9].Sat,

                    nombre11: inscrito[10].apellido_paterno + ' ' +
                        inscrito[10].apellido_materno + ' ' +
                        inscrito[10].nombre_usuario,
                    area11: inscrito[10].area,
                    rfc11: inscrito[10].rfc,
                    genero11: inscrito[10].genero,
                    plaza11: inscrito[10].plaza,
                    tipo11: inscrito[10].tipo_puesto,
                    nivel11: inscrito[10].nivel_puesto,
                    L11: inscrito[10].Mon, Ma11: inscrito[10].Tue, Mi11: inscrito[10].Wed,
                    J11: inscrito[10].Thu, V11: inscrito[10].Fri, S11: inscrito[10].Sat,

                    nombre12: inscrito[11].apellido_paterno + ' ' +
                        inscrito[11].apellido_materno + ' ' +
                        inscrito[11].nombre_usuario,
                    area12: inscrito[11].area,
                    rfc12: inscrito[11].rfc,
                    genero12: inscrito[11].genero,
                    plaza12: inscrito[11].plaza,
                    tipo12: inscrito[11].tipo_puesto,
                    nivel12: inscrito[11].nivel_puesto,
                    L12: inscrito[11].Mon, Ma12: inscrito[11].Tue, Mi12: inscrito[11].Wed,
                    J12: inscrito[11].Thu, V12: inscrito[11].Fri, S12: inscrito[11].Sat,

                    nombre13: inscrito[12].apellido_paterno + ' ' +
                        inscrito[12].apellido_materno + ' ' +
                        inscrito[12].nombre_usuario,
                    area13: inscrito[12].area,
                    rfc13: inscrito[12].rfc,
                    genero13: inscrito[12].genero,
                    plaza13: inscrito[12].plaza,
                    tipo13: inscrito[12].tipo_puesto,
                    nivel13: inscrito[12].nivel_puesto,
                    L13: inscrito[12].Mon, Ma13: inscrito[12].Tue, Mi13: inscrito[12].Wed,
                    J13: inscrito[12].Thu, V13: inscrito[12].Fri, S13: inscrito[12].Sat,

                    nombre14: inscrito[13].apellido_paterno + ' ' +
                        inscrito[13].apellido_materno + ' ' +
                        inscrito[13].nombre_usuario,
                    area14: inscrito[13].area,
                    rfc14: inscrito[13].rfc,
                    genero14: inscrito[13].genero,
                    plaza14: inscrito[13].plaza,
                    tipo14: inscrito[13].tipo_puesto,
                    nivel14: inscrito[13].nivel_puesto,
                    L14: inscrito[13].Mon, Ma14: inscrito[13].Tue, Mi14: inscrito[13].Wed,
                    J14: inscrito[13].Thu, V14: inscrito[13].Fri, S14: inscrito[13].Sat,

                    nombre15: inscrito[14].apellido_paterno + ' ' +
                        inscrito[14].apellido_materno + ' ' +
                        inscrito[14].nombre_usuario,
                    area15: inscrito[14].area,
                    rfc15: inscrito[14].rfc,
                    genero15: inscrito[14].genero,
                    plaza15: inscrito[14].plaza,
                    tipo15: inscrito[14].tipo_puesto,
                    nivel15: inscrito[14].nivel_puesto,
                    L15: inscrito[14].Mon, Ma15: inscrito[14].Tue, Mi15: inscrito[14].Wed,
                    J15: inscrito[14].Thu, V15: inscrito[14].Fri, S15: inscrito[14].Sat,

                    nombre16: inscrito[15].apellido_paterno + ' ' +
                        inscrito[15].apellido_materno + ' ' +
                        inscrito[15].nombre_usuario,
                    area16: inscrito[15].area,
                    rfc16: inscrito[15].rfc,
                    genero16: inscrito[15].genero,
                    plaza16: inscrito[15].plaza,
                    tipo16: inscrito[15].tipo_puesto,
                    nivel16: inscrito[15].nivel_puesto,
                    L16: inscrito[15].Mon, Ma16: inscrito[15].Tue, Mi16: inscrito[15].Wed,
                    J16: inscrito[15].Thu, V16: inscrito[15].Fri, S16: inscrito[15].Sat,

                    nombre17: inscrito[16].apellido_paterno + ' ' +
                        inscrito[16].apellido_materno + ' ' +
                        inscrito[16].nombre_usuario,
                    area17: inscrito[16].area,
                    rfc17: inscrito[16].rfc,
                    genero17: inscrito[16].genero,
                    plaza17: inscrito[16].plaza,
                    tipo17: inscrito[16].tipo_puesto,
                    nivel17: inscrito[16].nivel_puesto,
                    L17: inscrito[16].Mon, Ma17: inscrito[16].Tue, Mi17: inscrito[16].Wed,
                    J17: inscrito[16].Thu, V17: inscrito[16].Fri, S17: inscrito[16].Sat,

                    nombre18: inscrito[17].apellido_paterno + ' ' +
                        inscrito[17].apellido_materno + ' ' +
                        inscrito[17].nombre_usuario,
                    area18: inscrito[17].area,
                    rfc18: inscrito[17].rfc,
                    genero18: inscrito[17].genero,
                    plaza18: inscrito[17].plaza,
                    tipo18: inscrito[17].tipo_puesto,
                    nivel18: inscrito[17].nivel_puesto,
                    L18: inscrito[17].Mon, Ma18: inscrito[17].Tue, Mi18: inscrito[17].Wed,
                    J18: inscrito[17].Thu, V18: inscrito[17].Fri, S18: inscrito[17].Sat,

                    nombre19: inscrito[18].apellido_paterno + ' ' +
                        inscrito[18].apellido_materno + ' ' +
                        inscrito[18].nombre_usuario,
                    area19: inscrito[18].area,
                    rfc19: inscrito[18].rfc,
                    genero19: inscrito[18].genero,
                    plaza19: inscrito[18].plaza,
                    tipo19: inscrito[18].tipo_puesto,
                    nivel19: inscrito[18].nivel_puesto,
                    L19: inscrito[18].Mon, Ma19: inscrito[18].Tue, Mi19: inscrito[18].Wed,
                    J19: inscrito[18].Thu, V19: inscrito[18].Fri, S19: inscrito[18].Sat,

                    nombre20: inscrito[19].apellido_paterno + ' ' +
                        inscrito[19].apellido_materno + ' ' +
                        inscrito[19].nombre_usuario,
                    area20: inscrito[19].area,
                    rfc20: inscrito[19].rfc,
                    genero20: inscrito[19].genero,
                    plaza20: inscrito[19].plaza,
                    tipo20: inscrito[19].tipo_puesto,
                    nivel20: inscrito[19].nivel_puesto,
                    L20: inscrito[19].Mon, Ma20: inscrito[19].Tue, Mi20: inscrito[19].Wed,
                    J20: inscrito[19].Thu, V20: inscrito[19].Fri, S20: inscrito[19].Sat,

                    nombre21: inscrito[20].apellido_paterno + ' ' +
                        inscrito[20].apellido_materno + ' ' +
                        inscrito[20].nombre_usuario,
                    area21: inscrito[20].area,
                    rfc21: inscrito[20].rfc,
                    genero21: inscrito[20].genero,
                    plaza21: inscrito[20].plaza,
                    tipo21: inscrito[20].tipo_puesto,
                    nivel21: inscrito[20].nivel_puesto,
                    L21: inscrito[20].Mon, Ma21: inscrito[20].Tue, Mi21: inscrito[20].Wed,
                    J21: inscrito[20].Thu, V21: inscrito[20].Fri, S21: inscrito[20].Sat,

                    nombre22: inscrito[21].apellido_paterno + ' ' +
                        inscrito[21].apellido_materno + ' ' +
                        inscrito[21].nombre_usuario,
                    area22: inscrito[21].area,
                    rfc22: inscrito[21].rfc,
                    genero22: inscrito[21].genero,
                    plaza22: inscrito[21].plaza,
                    tipo22: inscrito[21].tipo_puesto,
                    nivel22: inscrito[21].nivel_puesto,
                    L22: inscrito[21].Mon, Ma22: inscrito[21].Tue, Mi22: inscrito[21].Wed,
                    J22: inscrito[21].Thu, V22: inscrito[21].Fri, S22: inscrito[21].Sat,

                    nombre23: inscrito[22].apellido_paterno + ' ' +
                        inscrito[22].apellido_materno + ' ' +
                        inscrito[22].nombre_usuario,
                    area23: inscrito[22].area,
                    rfc23: inscrito[22].rfc,
                    genero23: inscrito[22].genero,
                    plaza23: inscrito[22].plaza,
                    tipo23: inscrito[22].tipo_puesto,
                    nivel23: inscrito[22].nivel_puesto,
                    L23: inscrito[22].Mon, Ma23: inscrito[22].Tue, Mi23: inscrito[22].Wed,
                    J23: inscrito[22].Thu, V23: inscrito[22].Fri, S23: inscrito[22].Sat,

                    nombre24: inscrito[23].apellido_paterno + ' ' +
                        inscrito[23].apellido_materno + ' ' +
                        inscrito[23].nombre_usuario,
                    area24: inscrito[23].area,
                    rfc24: inscrito[23].rfc,
                    genero24: inscrito[23].genero,
                    plaza24: inscrito[23].plaza,
                    tipo24: inscrito[23].tipo_puesto,
                    nivel24: inscrito[23].nivel_puesto,
                    L24: inscrito[23].Mon, Ma24: inscrito[23].Tue, Mi24: inscrito[23].Wed,
                    J24: inscrito[23].Thu, V24: inscrito[23].Fri, S24: inscrito[23].Sat,

                    nombre25: inscrito[24].apellido_paterno + ' ' +
                        inscrito[24].apellido_materno + ' ' +
                        inscrito[24].nombre_usuario,
                    area25: inscrito[24].area,
                    rfc25: inscrito[24].rfc,
                    genero25: inscrito[24].genero,
                    plaza25: inscrito[24].plaza,
                    tipo25: inscrito[24].tipo_puesto,
                    nivel25: inscrito[24].nivel_puesto,
                    L25: inscrito[24].Mon, Ma25: inscrito[24].Tue, Mi25: inscrito[24].Wed,
                    J25: inscrito[24].Thu, V25: inscrito[24].Fri, S25: inscrito[24].Sat,

                    nombre26: inscrito[25].apellido_paterno + ' ' +
                        inscrito[25].apellido_materno + ' ' +
                        inscrito[25].nombre_usuario,
                    area26: inscrito[25].area,
                    rfc26: inscrito[25].rfc,
                    genero26: inscrito[25].genero,
                    plaza26: inscrito[25].plaza,
                    tipo26: inscrito[25].tipo_puesto,
                    nivel26: inscrito[25].nivel_puesto,
                    L26: inscrito[25].Mon, Ma26: inscrito[25].Tue, Mi26: inscrito[25].Wed,
                    J26: inscrito[25].Thu, V26: inscrito[25].Fri, S26: inscrito[25].Sat,

                    nombre27: inscrito[26].apellido_paterno + ' ' +
                        inscrito[26].apellido_materno + ' ' +
                        inscrito[26].nombre_usuario,
                    area27: inscrito[26].area,
                    rfc27: inscrito[26].rfc,
                    genero27: inscrito[26].genero,
                    plaza27: inscrito[26].plaza,
                    tipo27: inscrito[26].tipo_puesto,
                    nivel27: inscrito[26].nivel_puesto,
                    L27: inscrito[26].Mon, Ma27: inscrito[26].Tue, Mi27: inscrito[26].Wed,
                    J27: inscrito[26].Thu, V27: inscrito[26].Fri, S27: inscrito[26].Sat,

                    nombre28: inscrito[27].apellido_paterno + ' ' +
                        inscrito[27].apellido_materno + ' ' +
                        inscrito[27].nombre_usuario,
                    area28: inscrito[27].area,
                    rfc28: inscrito[27].rfc,
                    genero28: inscrito[27].genero,
                    plaza28: inscrito[27].plaza,
                    tipo28: inscrito[27].tipo_puesto,
                    nivel28: inscrito[27].nivel_puesto,
                    L28: inscrito[27].Mon, Ma28: inscrito[27].Tue, Mi28: inscrito[27].Wed,
                    J28: inscrito[27].Thu, V28: inscrito[27].Fri, S28: inscrito[27].Sat,

                    nombre29: inscrito[28].apellido_paterno + ' ' +
                        inscrito[28].apellido_materno + ' ' +
                        inscrito[28].nombre_usuario,
                    area29: inscrito[28].area,
                    rfc29: inscrito[28].rfc,
                    genero29: inscrito[28].genero,
                    plaza29: inscrito[28].plaza,
                    tipo29: inscrito[28].tipo_puesto,
                    nivel29: inscrito[28].nivel_puesto,
                    L29: inscrito[28].Mon, Ma29: inscrito[28].Tue, Mi29: inscrito[28].Wed,
                    J29: inscrito[28].Thu, V29: inscrito[28].Fri, S29: inscrito[28].Sat,

                    nombre30: inscrito[29].apellido_paterno + ' ' +
                        inscrito[29].apellido_materno + ' ' +
                        inscrito[29].nombre_usuario,
                    area30: inscrito[29].area,
                    rfc30: inscrito[29].rfc,
                    genero30: inscrito[29].genero,
                    plaza30: inscrito[29].plaza,
                    tipo30: inscrito[29].tipo_puesto,
                    nivel30: inscrito[29].nivel_puesto,
                    L30: inscrito[29].Mon, Ma30: inscrito[29].Tue, Mi30: inscrito[29].Wed,
                    J30: inscrito[29].Thu, V30: inscrito[29].Fri, S30: inscrito[29].Sat,

                });
                
// SELECT cedula_inscripcion.rfc, lista_asistencia.fecha_asistencia FROM cedula_inscripcion
// INNER JOIN curso ON curso.grupo = cedula_inscripcion.grupo  
// INNER JOIN usuario ON usuario.rfc = cedula_inscripcion.rfc
// INNER JOIN lista_asistencia ON lista_asistencia.rfc = cedula_inscripcion.rfc
// WHERE cedula_inscripcion.grupo = 'PRUEBA' 
// ORDER BY usuario.apellido_paterno


                let objectValues = Object.assign({}, ...arr);

                var myJSON = JSON.stringify(objectValues);

                var object = myJSON.replace(/undefined/g, " ");

                var resp = JSON.parse(object);

                console.log(clean(resp))


                doc.setData(resp);
                doc.render();

                console.log('Lista generada');
                var buf = doc.getZip()
                    .generate({ type: 'nodebuffer' });
                var anio = new Date().getFullYear();
                var mes = getMonthName(new Date().getMonth());

                var direccionAnio = 'Documentos/asistencia/' + anio + '/';

                if (!fs.existsSync(path.resolve(__dirname, direccionAnio))) {
                    fs.mkdirSync(path.resolve(__dirname, direccionAnio));
                }
                var direccionMes = direccionAnio + '/' + mes;

                if (!fs.existsSync(path.resolve(__dirname, direccionMes))) {
                    fs.mkdirSync(path.resolve(__dirname, direccionMes));
                }
                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                fs.writeFileSync(path.resolve(__dirname, direccionMes + '/LISTA DE ASISTENCIA- ' + group + '.docx'), buf);

                var pathListaCursos = path.resolve(__dirname, direccionMes + '/LISTA DE ASISTENCIA- ' + group + '.docx');

                return res.download(pathListaCursos, function (err) {
                    if (err) {
                        // if the file download fails, we throw an error
                        res.status(400).send({
                            message: 'Error al descargar cedula de inscripción'
                        });
                    };
                });


            });
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al descargar cedula sendfilename'
        });
    }
}

function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj
}

exports.fileCoursesList = async (req, res, next) => {
    try {


        var content = fs.readFileSync(path.resolve(__dirname, 'index_cursos.docx'), 'binary');
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, { linebreaks: true });

        var date = new Date(Date.now());

        db.query('SELECT * FROM curso WHERE mostrar_curso = 1', (error, cursos) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar cursos (imprimir cursos): ' + error
                });
            };
            if (cursos.length < 1) {
                return res.status(200).send({
                    message: 'No hay cursos disponibles'
                });
            };

            var arrId = [];
            arrId.push(
                {
                    inner: [
                        { id: 'No.' },
                        { id: 'Nombre de los Cursos' },
                        { id: 'Periodo de Realización' },
                        { id: 'Lugar' },
                        { id: 'No. de horas x Curso' },
                        { id: 'Instructor' },
                        { id: 'Dirigido a:' },
                        { id: 'Observaciones' }
                    ]
                });
            Object.keys(cursos).forEach(function (key) {
                var row = cursos[key];

                arrId.push(
                    {
                        inner: [
                            { id: Number(key) + 1 },
                            { id: row.nombre_curso },
                            {
                                id: moment(new Date(row.periodo_inicial)).format("DD-MM-YYYY")
                                    + ' al '
                                    + moment(new Date(row.periodo_final)).format("DD-MM-YYYY")
                            }
                            ,
                            { id: row.aula },
                            {
                                id: row.num_horas + ' hrs.\n' +
                                    moment(new Date(row.hora_inicial)).format("HH:mm")
                                    + ' a '
                                    + moment(new Date(row.hora_final)).format("HH:mm") + ' hrs.'
                            },
                            { id: row.nombre_instructor },

                            { id: row.dirigido_a },
                            { id: row.observaciones }
                        ]
                    });

                if ((cursos.length - 1) == key) {

                    doc.setData({
                        "outer": arrId
                    });

                    doc.render();
                    console.log('Cursos registrados en DOC');
                    var buf = doc.getZip()
                        .generate({ type: 'nodebuffer' });
                    var anio = new Date().getFullYear();
                    var mes = getMonthName(new Date().getMonth());

                    var direccionAnio = 'Documentos/cursos/' + anio + '/';

                    if (!fs.existsSync(path.resolve(__dirname, direccionAnio))) {
                        fs.mkdirSync(path.resolve(__dirname, direccionAnio));
                    }
                    var direccionMes = direccionAnio + '/' + mes;

                    if (!fs.existsSync(path.resolve(__dirname, direccionMes))) {
                        fs.mkdirSync(path.resolve(__dirname, direccionMes));
                    }
                    fechaActual = new Date();
                    console.log(moment(fechaActual).format("DD-MM-YYYY"))
                    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                    fs.writeFileSync(path.resolve(__dirname, direccionMes + '/PROGRAMA INSTITUCIONAL- ' + moment(fechaActual).format("DD-MM-YYYY") + '.docx'), buf);

                    var pathListaCursos = path.resolve(__dirname, direccionMes + '/PROGRAMA INSTITUCIONAL- ' + moment(fechaActual).format("DD-MM-YYYY") + '.docx');

                    return res.send({
                        fileName: 'PROGRAMA INSTITUCIONAL- ' + moment(fechaActual).format("DD-MM-YYYY") + '.docx'
                    })
                }


            });
        });
    } catch (error) {
        console.log('SERVIDOR: ' + error);
        return res.status(500).send({
            message: error
        });
    }
}

exports.downloadCourses = async (req, res) => {
    try {
        //var pathCedula = __dirname + '/Documentos/cursos/CEDULA DE INSCRIPCION- ' + decoded.id + ' - ' + group + '.docx'
        fechaActual = new Date();
        console.log('DESCARGAR: ');
        console.log(moment(new Date(fechaActual)).format("DD-MM-YYYY"))
        var files = searchRecursive(__dirname + '/Documentos/cursos', 'PROGRAMA INSTITUCIONAL- ' + moment(fechaActual).format("DD-MM-YYYY") + '.docx');
        console.log(files[0]);
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
};

var searchRecursive = function (dir, pattern) {
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