const db = require('../../db');




exports.getCoursesCharts = async (req, res) => {

    db.query(`SELECT * FROM curso`, (error, cursos) => {
        if (error) {
            return res.status(500).send({
                message: 'Error al consultar estadisticas ' + error
            });
        };

        var periodos = [];
        var resArray = [];
        const nombreMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        cursos.forEach(element => {
            var fecha = element.periodo_inicial
            //console.log(new Date(fecha).getFullYear());
            const foundAnio = periodos.some(el => el.anio === new Date(fecha).getFullYear());
            const foundMes = periodos.some(el => el.mes === nombreMeses[new Date(fecha).getMonth()]);

            if (!foundAnio || !foundMes) {
                periodos.push({
                    anio: new Date(fecha).getFullYear(),
                    mes: nombreMeses[new Date(fecha).getMonth()]
                });
            }
        });
        console.log(periodos);

        periodos.forEach((element, idx, array) => {
            console.log(element.anio);

            db.query(`SELECT COALESCE(COUNT(*),0) AS 'numeroDeCursos' FROM curso 
            WHERE periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, numCursos) => {

                db.query(`SELECT COALESCE(COUNT(*),0) AS 'numParticipantes' FROM cedula_inscripcion 
                WHERE fecha_inscrito BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, numParticipantes) => {

                    db.query(`SELECT COALESCE(COUNT(*),0) AS 'numProfesional' FROM curso 
                    WHERE tipo_curso = 'PROFESIONAL' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrProfesional) => {

                        db.query(`SELECT COALESCE(COUNT(*),0) AS 'numDocente' FROM curso 
                        WHERE tipo_curso = 'DOCENTE' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrDocente) => {

                            db.query(`SELECT COALESCE(COUNT(*),0) AS 'numCurso' FROM curso 
                            WHERE tipo_capacitacion = 'CURSO' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCurso) => {

                                db.query(`SELECT COALESCE(COUNT(*),0) AS 'numTaller' FROM curso 
                                WHERE tipo_capacitacion = 'TALLER' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrTaller) => {

                                    db.query(`SELECT COALESCE(COUNT(*),0) AS 'numCursoTaller' FROM curso 
                                    WHERE tipo_capacitacion = 'CURSO/TALLER' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCursoTaller) => {

                                        db.query(`SELECT COALESCE(COUNT(*),0) AS 'numConferencia' FROM curso 
                                        WHERE tipo_capacitacion = 'CONFERENCIA' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrConferencia) => {

                                            db.query(`SELECT COALESCE(COUNT(*),0) AS 'numDiplomado' FROM curso 
                                            WHERE tipo_capacitacion = 'DIPLOMADO' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrDiplomado) => {

                                                db.query(`SELECT COALESCE(COUNT(*),0) AS 'numEEB' FROM curso 
                                                WHERE departamento = 'ELÉCTRICA, ELECTRÓNICA, BIOMÉDICA' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrEEB) => {

                                                    db.query(`SELECT COALESCE(COUNT(*),0) AS 'numSI' FROM curso 
                                                    WHERE departamento = 'SISTEMAS E INFORMATICA' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrSI) => {

                                                        db.query(`SELECT COALESCE(COUNT(*),0) AS 'numMMA' FROM curso 
                                                        WHERE departamento = 'METAL MECANICA Y AERONAUTICA' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrMMA) => {

                                                            db.query(`SELECT COALESCE(COUNT(*),0) AS 'numIndustrial' FROM curso 
                                                            WHERE departamento = 'INDUSTRIAL' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrIndustrial) => {

                                                                db.query(`SELECT COALESCE(COUNT(*),0) AS 'numCB' FROM curso 
                                                                WHERE departamento = 'CIENCIAS BASICAS' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCB) => {

                                                                    db.query(`SELECT COALESCE(COUNT(*),0) AS 'numEA' FROM curso 
                                                                    WHERE departamento = 'ECONOMICO ADMINISTRATIVO' AND periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrEA) => {

                                                                        resArray.push({
                                                                            Periodo: element.mes + ' - ' + element.anio,
                                                                            Cursos: numCursos[0].numeroDeCursos,
                                                                            Participantes: numParticipantes[0].numParticipantes,
                                                                            Profesional: chrProfesional[0].numProfesional,
                                                                            Docente: chrDocente[0].numDocente,
                                                                            Curso: chrCurso[0].numCurso,
                                                                            Taller: chrTaller[0].numTaller,
                                                                            CursoTaller: chrCursoTaller[0].numCursoTaller,
                                                                            Conferencia: chrConferencia[0].numConferencia,
                                                                            Diplomado: chrDiplomado[0].numDiplomado,
                                                                            ElectricaElectronicaBiomedica: chrEEB[0].numEEB,
                                                                            SistemasInformatica: chrSI[0].numSI,
                                                                            MetalMecanicaAeronautica: chrMMA[0].numMMA,
                                                                            Industrial: chrIndustrial[0].numIndustrial,
                                                                            CienciasBasicas: chrCB[0].numCB,
                                                                            EconomicoAdministrativo: chrEA[0].numEA,
                                                                        });

                                                                        if (idx === array.length - 1) {
                                                                            console.log(resArray)
                                                                            return res.status(200).send(resArray);
                                                                        }
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

exports.getPartakersCharts = async (req, res) => {

    db.query(`SELECT * FROM curso`, (error, cursos) => {
        if (error) {
            return res.status(500).send({
                message: 'Error al consultar estadisticas ' + error
            });
        };

        var periodos = [];
        var resArray = [];
        const nombreMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        cursos.forEach(element => {
            var fecha = element.periodo_inicial
            //console.log(new Date(fecha).getFullYear());
            const foundAnio = periodos.some(el => el.anio === new Date(fecha).getFullYear());
            const foundMes = periodos.some(el => el.mes === nombreMeses[new Date(fecha).getMonth()]);

            if (!foundAnio || !foundMes) {
                periodos.push({
                    anio: new Date(fecha).getFullYear(),
                    mes: nombreMeses[new Date(fecha).getMonth()]
                });
            }
        });
        console.log(periodos);

        periodos.forEach((element, idx, array) => {
            console.log(element.anio);


            db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numProfesional' FROM cedula_inscripcion 
                    LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                    WHERE tipo_curso = 'PROFESIONAL' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrProfesional) => {

                db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numDocente' FROM cedula_inscripcion 
                LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                WHERE tipo_curso = 'DOCENTE' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrDocente) => {

                    db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numCurso' FROM cedula_inscripcion 
                    LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                    WHERE tipo_capacitacion = 'CURSO' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCurso) => {

                        db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numTaller' FROM cedula_inscripcion 
                        LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                        WHERE tipo_capacitacion = 'TALLER' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrTaller) => {

                            db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numCursoTaller' FROM cedula_inscripcion 
                            LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                            WHERE tipo_capacitacion = 'CURSO/TALLER' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCursoTaller) => {

                                db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numConferencia' FROM cedula_inscripcion 
                                LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                WHERE tipo_capacitacion = 'CONFERENCIA' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrConferencia) => {

                                    db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numDiplomado' FROM cedula_inscripcion 
                                    LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                    WHERE tipo_capacitacion = 'DIPLOMADO' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrDiplomado) => {

                                        db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numEEB' FROM cedula_inscripcion 
                                        LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                        WHERE departamento = 'ELÉCTRICA, ELECTRÓNICA, BIOMÉDICA' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrEEB) => {

                                            db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numSI' FROM cedula_inscripcion 
                                            LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                            WHERE departamento = 'SISTEMAS E INFORMATICA' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrSI) => {

                                                db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numMMA' FROM cedula_inscripcion 
                                                LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                                WHERE departamento = 'METAL MECANICA Y AERONAUTICA' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrMMA) => {

                                                    db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numIndustrial' FROM cedula_inscripcion 
                                                    LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                                    WHERE departamento = 'INDUSTRIAL' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrIndustrial) => {

                                                        db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numCB' FROM cedula_inscripcion 
                                                        LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                                        WHERE departamento = 'CIENCIAS BASICAS' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrCB) => {

                                                            db.query(`SELECT COALESCE(COUNT(cedula_inscripcion.grupo),0) AS 'numEA' FROM cedula_inscripcion 
                                                            LEFT JOIN curso ON curso.grupo = cedula_inscripcion.grupo 
                                                            WHERE departamento = 'ECONOMICO ADMINISTRATIVO' AND curso.periodo_inicial BETWEEN '${element.anio}-01-01' AND '${element.anio}-12-31'`, (error, chrEA) => {

                                                                resArray.push({
                                                                    Periodo: element.mes + ' - ' + element.anio,
                                                                    Profesional: chrProfesional[0].numProfesional,
                                                                    Docente: chrDocente[0].numDocente,
                                                                    Curso: chrCurso[0].numCurso,
                                                                    Taller: chrTaller[0].numTaller,
                                                                    CursoTaller: chrCursoTaller[0].numCursoTaller,
                                                                    Conferencia: chrConferencia[0].numConferencia,
                                                                    Diplomado: chrDiplomado[0].numDiplomado,
                                                                    ElectricaElectronicaBiomedica: chrEEB[0].numEEB,
                                                                    SistemasInformatica: chrSI[0].numSI,
                                                                    MetalMecanicaAeronautica: chrMMA[0].numMMA,
                                                                    Industrial: chrIndustrial[0].numIndustrial,
                                                                    CienciasBasicas: chrCB[0].numCB,
                                                                    EconomicoAdministrativo: chrEA[0].numEA,
                                                                });

                                                                if (idx === array.length - 1) {
                                                                    console.log(resArray)
                                                                    return res.status(200).send(resArray);
                                                                }
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}