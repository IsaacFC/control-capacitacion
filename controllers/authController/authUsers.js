const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const db = require('../../db');

exports.registerUser = async (req, res) => {
    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT tipo_usuario FROM usuario WHERE rfc = ?', [decoded.id], async (error, result) => {
            if (result[0].tipo_usuario === 'COORDINADOR') {
                const { rfc, userType } = req.body;
                var rfcUpper = rfc.toUpperCase();

                // encripta la contraseña con 8 rondas
                let contrasenaEncriptada = await bcryptjs.hash((rfc + '@!'), 8);





                db.query('INSERT INTO usuario SET ?', {
                    nombre_usuario: 'NA',
                    apellido_paterno: 'NA',
                    apellido_materno: 'NA',
                    rfc: rfcUpper,
                    genero: '-',
                    departamento_usuario: 'NA',
                    tipo_usuario: userType,
                    plaza: 'NA',
                    contrasena: contrasenaEncriptada
                }, (error, results) => {
                    // si la llave primaria está en la BD... entonces despliega error
                    if (error) {
                        console.log(error);
                        if (error.errno === 1062) {
                            return res.status(409).send({
                                message: 'El RFC \'' + rfcUpper + '\' ya existe'
                            });
                        }
                    } else {
                        return res.status(201).send('Usuario creado');
                    }
                });
            } else {
                return res.status(401).send({
                    message: 'Acceso denegado'
                });
            }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al registrar usuario. \nError: ' + error
        });
    }
}

exports.modifyUser = async (req, res) => {

    try {

        const {
            name, firstLastName, secondLastName, rfc, newRfc, email, phoneNumber,
            plaza, gender, department, userType
        } = req.body;
        //console.log(plaza);
        var newRfcUpper = newRfc.toUpperCase();

        // const data = {
        //     nombre_usuario: name,
        //     apellido_paterno: firstLastName,
        //     apellido_materno: secondLastName,
        //     genero: gender,
        //     departamento_usuario: department,
        //     tipo_usuario: userType,
        //     plaza: plaza
        // };
        // console.log(data);
        db.query('SELECT * FROM usuario WHERE rfc = ?', [newRfcUpper], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Error al consultar el usuario (modificar): ' + error
                });
            };
            console.log(newRfcUpper);
            if (result.length > 0) {
                console.log('El RFC \'' + newRfcUpper + '\' ya existe.');
                return res.status(400).send({
                    message: 'El RFC \'' + newRfcUpper + '\' ya existe.'
                });
            }
            if (newRfcUpper !== '') {
                db.query('UPDATE usuario SET nombre_usuario = ?, ' +
                    'apellido_paterno = ?, ' +
                    'apellido_materno = ?, ' +
                    'rfc = ?, ' +
                    'genero = ?, ' +
                    'departamento_usuario = ?, ' +
                    'email = ?, ' +
                    'telefono = ?, ' +
                    'plaza = ?, ' +
                    'tipo_usuario = ? WHERE rfc = ?',
                    [name, firstLastName, secondLastName, newRfcUpper, email, phoneNumber, plaza, gender, department, userType, rfc], async (error, results) => {

                        if (error) {
                            if (error.errno === 1451) {
                                console.log('Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.');
                                return res.status(409).send({
                                    message: 'Este usuario imparte o se ha inscrito a un curso. No se puede modificar su RFC.'
                                });
                            }
                        } else {
                            //console.log('Usuario modificado ');
                            //return res.send(results);
                            return res.status(200).send({
                                message: 'Usuario modificado'
                            });

                        }
                    });
            } else {
                db.query('UPDATE usuario SET nombre_usuario = ?, ' +
                    'apellido_paterno = ?, ' +
                    'apellido_materno = ?, ' +
                    'email = ?, ' +
                    'telefono = ?, ' +
                    'plaza = ?, ' +
                    'tipo_usuario = ? WHERE rfc = ?',
                    [name, firstLastName, secondLastName, email, phoneNumber, plaza, userType, rfc], async (error, results) => {

                        if (error) {
                            return res.status(500).send({
                                message: 'Error al modificar el usuario: ' + error
                            });
                        } else {
                            console.log('Usuario modificado ');
                            //return res.send(results);
                            return res.status(200).send('Usuario modificado');

                        }
                    });
            }

        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al modificar usuario. \nError: ' + error
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        console.log('Eliminar: ' + req.params.tagId);
        const rfc = req.params.tagId;
        db.query('DELETE FROM usuario WHERE rfc = ?', [rfc], (error, result) => {
            if (error) {
                if (error.errno === 1451) {
                    console.log('Este usuario imparte o se ha inscrito a un curso. No se puede borrar.');
                    return res.status(409).send({
                        message: 'Este usuario imparte o se ha inscrito a un curso. No se puede borrar.'
                    });
                }
            } else {
                console.log('Usuario eliminado');
                return res.status(200).send({
                    message: 'Usuario eliminado'
                });
            }
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al eliminar usuario. \nError: ' + error
        });
    }
}

exports.restoreUserPassword = async (req, res) => {
    try {
        console.log('Reestablecer: ' + req.params.tagId);
        const rfc = req.params.tagId;

        const newPassword = rfc + '@!';
        // encripta la contraseña con 8 rondas
        let newEncryptedPassword = await bcryptjs.hash(newPassword, 8);
        console.log(newEncryptedPassword);

        db.query('SELECT * FROM usuario WHERE rfc = ?', [rfc], (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: 'Error al consultar el usuario (reestablecer contraseña): ' + error
                });
            }

            db.query('UPDATE usuario SET contrasena = ? WHERE rfc = ?', [newEncryptedPassword, rfc], (error, results) => {
                // si la llave primaria está en la BD... entonces despliega error
                if (error) {
                    return res.status(500).send({
                        message: 'Error al reestablecer contraseña: ' + error
                    });
                } else {
                    console.log('Contraseña reestablecida');
                    return res.status(200).send({
                        message: 'Contraseña reestablecida'
                    });
                }
            });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Error con el servidor al reestablecer contraseña. \nError: ' + error
        });
    }
}

exports.registrarTODO = async (req, res) => {
    try {

        const arrRFC = ["AATA881115QD7",
            "AUFC610317QJ4",
            "AAJO8002243K1",
            "AADC880409SY3",
            "AADG550317ET1",
            "BERR700921RQ9",
            "BERR721011EI6",
            "BOGJ650410IC2",
            "BAPM9003135U6",
            "CAPF890215E19",
            "CALP810120KA3",
            "CALP771228LK6",
            "CASJ790131M44",
            "COGR8606098Q6",
            "DOVM661106L17",
            "DUAF850329M96",
            "DUTU880405666",
            "FEGL891005QHA",
            "FEML561217CX3",
            "GACA660305896",
            "GAMA6812161M8",
            "GABL490212SNA",
            "HECA881030BA4",
            "HEGK900414HQ5",
            "LEMB891129GI9",
            "LELL7104246I1",
            "LEQC510702FUA",
            "LONS580404P34",
            "MACG6705058QA",
            "MAAH710113C76",
            "MEPK871109B48",
            "MOGH570110CD5",
            "NOOL901009PD8",
            "OIGR770619944",
            "PALA660407P88",
            "PELJ660102339",
            "QUTA490512E58",
            "RIFJ710618HL5",
            "ROJA811004BJ8",
            "ROPD690202UH0",
            "RUVD920706NA4",
            "SAGA850118N71",
            "SACL7107063M5",
            "SAQR941207IV1",
            "SARA650814R2A",
            "SOLJ641012UU5",
            "SORF890729H87",
            "SOHJ721220GD7",
            "TOGC611104338",
            "VASA580914SX4",
            "VAOM6405018R1",
            "VABI950715B25",
            "ZAAM6406075E0",
            "AOLT531224NY7",
            "AANA7903192I8",
            "AEHR700617I49",
            "AIGC711008376",
            "AOSL590428614",
            "BOLB810927FQ1",
            "BACR860428T57",
            "CAGX560428CG4",
            "CAHA531018MUA",
            "CAAA670726CX5",
            "CORP781012RK3",
            "CONC670420F80",
            "CULJ570727550",
            "VAEC671009L24",
            "DENJ800929GR0",
            "DUTJ6208166A8",
            "GABV530524KR2",
            "GADS6308233I3",
            "GAOL751001CJ0",
            "GAZK870102KFA",
            "GOVM690119PZ5",
            "GIGM521011HM9",
            "GUCD6109078G3",
            "HEBR700830PQ8",
            "HELG7412011H0",
            "HERA830519TL4",
            "HIGR560112PJ1",
            "IACE481120FJ4",
            "JAVC8310162Q3",
            "JIFE570121SX1",
            "LAAP590427Q19",
            "LICI710519CQ1",
            "LOMA680113FF2",
            "LOZR7709017R4",
            "MAAI860124KX3",
            "MAAK950523TW0",
            "MARJ720224K75",
            "MACM7210093M2",
            "MEGA581119QN3",
            "MENA591114J83",
            "MECC560502581",
            "MOTG731219K98",
            "MOZM750324QL2",
            "MOGE8310011S8",
            "NARL680928J29",
            "PEMI8006101A3",
            "PEAL771123V7A",
            "PIAD841229269",
            "PIMG5405169I0",
            "PEIS580320797",
            "RAPM841025746",
            "RARM790915618",
            "RIAF561004A98",
            "ROAG590327PQ4",
            "ROHZ7010102P9",
            "SAFR831220J17",
            "SAGM700124EX2",
            "SASM680312LF9",
            "SOEE730706FE2",
            "SOPD69101743A",
            "TOHB641231NM8",
            "VABM7104116T8",
            "VADM9508182P3",
            "VASA6407018Q1",
            "VEOM7012094Y8",
            "VIRE480103H56",
            "AEOD850715QI2",
            "CEOJ820116SR1",
            "COVH680316AF7",
            "GACJ650202T63",
            "GAQF760729NL4",
            "GUEJ810713SI2",
            "IIIJ760401VEA",
            "LEQC790208TF9",
            "LOCR6101297L4",
            "MEMF590309FI2",
            "MESL6608192Q9",
            "ROMO841211921",
            "RUTR6710199QA",
            "SALU650327TP1",
            "SAFD600816E54",
            "UEML930816C6A",
            "VABJ510805IS9",
            "VAGF6610194L1",
            "ZACR840809CY4",
            "AERR780210L4A",
            "AUPM8111116A7",
            "AALF880726IS2",
            "CAMA580120IJ1",
            "COCH630501DU8",
            "DAMA950409134",
            "FEPJ6904137T2",
            "GAAL620916LF8",
            "GAAD960719BZ6",
            "GALE9609032U6",
            "GAJA9409045I9",
            "GOVM901017RL4",
            "LESF940117AC6",
            "MEVA751028IV1",
            "MEVF780829U57",
            "MEGJ630119GF0",
            "MOJC4905113A9",
            "MORE640927PB8",
            "MUAE710329SX1",
            "OOAD790210316",
            "OOBS910904TIA",
            "OUDI941018BS8",
            "PEPC801115D49",
            "RABL931118165",
            "ROCJ550111GN8",
            "SABH610413JF1",
            "SAMM890509PW7",
            "SOSJ551218IP8",
            "TARV9309308E0",
            "TAFJ5509052I1",
            "ZUMJ570627PZ9",
            "AUTH820114LH7",
            "AUBV660804M37",
            "AEGG520213BZ7",
            "AUCA701129JN9",
            "CARJ9104245S4",
            "CACH8410045G7",
            "CAGL481012V7A",
            "CEFA751018ME6",
            "CAME720513KN1",
            "CAMR941209ED0",
            "COSA650711KC7",
            "FECR780630NXA",
            "GACS850316CS9",
            "GACX781019IB5",
            "GAGL6404186Y8",
            "GAGH560329MX3",
            "IARL630917Q63",
            "LEFS690404D85",
            "LOGL860731SG6",
            "MAHP780621H83",
            "MAML820520F97",
            "MARJ590408LD0",
            "MEOR8001212U8",
            "MOQL660211LF0",
            "MOGO641210GJ2",
            "MOVE900418AL6",
            "MOMJ930707LZ3",
            "MOSH720912IE6",
            "MOHC650315R68",
            "MUYR841024I8A",
            "NAMF500802U4A",
            "NAUM760805K53",
            "OOLD521211I20",
            "OOAD910113K59",
            "QUGE711227352",
            "RATF7510058Q5",
            "REYA920217VC8",
            "RIRA870925UJ0",
            "RINJ760926HH2",
            "RODA7802129Z8",
            "SOVD960830Q5A",
            "TEGE941026CR2",
            "VAGF660828436",
            "VARF9209047W6",
            "VARA910209FL9",
            "WEHF491202JUO",
            "AERC730214Q67",
            "BAMJ660327RH8",
            "BOCR540128QA8",
            "CELT520225476",
            "COGR670918629",
            "DURA830819FB9",
            "FEDG731203S68",
            "FOLJ6011274R0",
            "GASC690329JGA",
            "GAFE820113BS1",
            "GOEH780121AK7",
            "GUCJ771128P44",
            "HECJ920123KT1",
            "HUCY770725HR2",
            "IALF620926F16",
            "IASC610716GM5",
            "JABV6105226I7",
            "LOCL700403F32",
            "MAMJ560425EV9",
            "MAGA5607013KA",
            "MERA760611N37",
            "MICA6906211RA",
            "MOEI791202TU9",
            "NAAC840505PT5",
            "NUTJ610924NQ7",
            "PEPD550315I23",
            "RAAR650521MB0",
            "ROGN930928IV8",
            "SAOM7501128V8",
            "SAVJ710703118",
            "SAWB650915K74",
            "SEZM720403BD7",
            "TUVD5708058X2",
            "VAHA731024AKA",
            "VEMJ691023EY4",
            "ZEMF611123P31",
            "AUVJ9010144B1",
            "AAMS6601055F2",
            "AETO770709T79",
            "CEBE820403M14",
            "CICA8708202H6",
            "CICM7512182H1",
            "COSA620217UH5",
            "COSA750430S15",
            "COMC720121R51",
            "SORM851211UB3",
            "EICA810726LC7",
            "EIRL751021VC6",
            "EIBJ910522LQ5",
            "EUSL610531EKO",
            "FOVL650213CD1",
            "GALL700526QX0",
            "GAAD8305222S5",
            "GATR9107158H3",
            "GUCJ880923EY6",
            "HEFB670913DI4",
            "HEGL770401SA5",
            "IAAP820709710",
            "IURD8705117HA",
            "LOBS801005FL7",
            "LOED8803165NA",
            "LOIL870902AY5",
            "LOMF630531385",
            "LUZC830704GCA",
            "MAZO900930PB7",
            "MARA821003A57",
            "MEPG690905HU8",
            "MOEE870427TZ0",
            "NETJ881225498",
            "OOMS820619ID6",
            "OADG740812BC7",
            "OEEL870224FR9",
            "PAMG770111RW0",
            "PUVJ701119H50",
            "PUBR700924671",
            "RAHR830411EX9",
            "RILR741010LA6",
            "RORF700226IU6",
            "ROYH680911IT4",
            "RUSA860527LU6",
            "SIRC700418SK4",
            "SOMJ920517MV9",
            "TEMJ6911142BA",
            "TOFA5107059A5",
            "VETT671225GJ4",
            "VICT621104I12",
            "CAGF8411147J4",
            "VEBE541231BI5",
            "DIMM600927L27",
            "GABR621022UPA",
            "GUSE8404119G8",
            "GUUR640716E91",
            "HEAF6903064S4",
            "HEGO831003JF6",
            "HOMA6411307S0",
            "LIRM7705205VA",
            "MAVF610628KI0",
            "MEMS670516IV3",
            "PAMB540720HQ1",
            "QUVG7111027V7",
            "RICC600724MR2",
            "ROEO7602141G7",
            "ROGC561022UW6",
            "RUDG690903Q59",
            "SEET6405248XA",
            "TECM690507DP3",
            "VAGA561005GD6",
            "VAPG8012106B4",
            "MAVC760201RX9",
            "PEAC8707162Q6",
            "TOAE8701088M3"
        ];

        arrRFC.forEach(async (rfc) => {
            // encripta la contraseña con 8 rondas
            let contrasenaEncriptada = await bcryptjs.hash((rfc + '@!'), 8);

            db.query('INSERT INTO usuario SET ?', {
                nombre_usuario: 'NA',
                apellido_paterno: 'NA',
                apellido_materno: 'NA',
                rfc: rfc,
                genero: '-',
                departamento_usuario: 'NA',
                tipo_usuario: "INSTRUCTOR",
                plaza: 'NA',
                contrasena: contrasenaEncriptada
            }, (error, results) => {
                // si la llave primaria está en la BD... entonces despliega error
                if (error) {
                    console.log(error);
                    if (error.errno === 1062) {
                        return res.status(409).send({
                            message: 'El RFC \'' + rfc + '\' ya existe'
                        });
                    }
                } else {
                    console.log('CREADO: ' + rfc)
                    //return res.status(201).send('Usuario creado');
                }
            });
        });




    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error con el servidor al registrar usuario. \nError: ' + error
        });
    }
}