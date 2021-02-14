const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../../db');
var randtoken = require('rand-token');
const { promisify } = require('util');
const { Console } = require('console');


exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log(email + ' ' + password);
        if (!email || !password) {
            return res.status(400).send({
                message: 'Favor de introducir un ID o Contraseña'
            });
        };
        var rfcUpper = email.toUpperCase();
        db.query('SELECT * FROM usuario WHERE rfc = ?', [rfcUpper], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            // si el ID no existe o si la contraseña no es correcta...
            if (results.length < 1 || !(await bcryptjs.compare(password, results[0].contrasena))) {
                // 401 es estado para PROHIBIDO
                console.log('Usuario o contraseña incorrectos');
                return res.status(401).send({
                    error: 'Usuario o contraseña incorrectos'
                });
            } else {
                const id = results[0].id_usuario;
                const token = jwt.sign({ id: rfcUpper }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                let refreshToken = jwt.sign({ id: rfcUpper }, process.env.REFRESH_TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: process.env.REFRESH_TOKEN_LIFE
                });


                console.log("Sesion iniciada para " + rfcUpper);

                // Establece opciones de cookie
                const cookieOptions = {
                    expires: new Date(
                        // Convierte fecha expiracion en milisegundos multiplicando (24 hrs * 60 mins * 60 seg * 1000 ms)
                        Date.now() + 60 * 60 *  60 * 60 * 1000
                        
                        //+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                const cookieOptionsRefresh = {
                    expires: new Date(
                        // Convierte fecha expiracion en milisegundos multiplicando (24 hrs * 60 mins * 60 seg * 1000 ms)
                        Date.now() + 60 * 60 *  60 * 60 * 1000
                        
                        //+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                console.log(new Date( Date.now() + 60 * 1000 ))
                console.log(process.env.REFRESH_TOKEN_LIFE)

                const data =
                {
                    idToken: token,
                    refreshToken: refreshToken,
                    expiresIn: //5 * 60 * 
                    60 * 60 *  60 * 60 * 1000,
                    localId: id,
                    userRole: results[0].tipo_usuario
                };
                // console.log(data);
                // Activa cookie en navegador con nombre, token y opciones.
                res.cookie('jwt', token, cookieOptions);
                res.cookie('jwtRefresh', refreshToken, cookieOptionsRefresh);
                return res.status(200).send(data);
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}



exports.refresh =  async (req, res) => {
    console.log('Refrescar')
    let accessToken = req.cookies.jwt;
    const { refreshToken } = req.body;
    console.log(accessToken);
    console.log(process.env.JWT_SECRET);

    
    
    if (!accessToken) {
        console.log('No hay cookies');
        return res.status(403).send({
            message: 'No hay cookies. Cierre sesion e inicie de nuevo.'
        });
    };

    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    // let payload
    // try {
    //     payload = jwt.verify(accessToken, process.env.JWT_SECRET)
    // }
    // catch (e) {
    //     return res.status(401).send()
    // }

    //retrieve the refresh token from the users array
    //let refreshToken = users[payload.username].refreshToken

    //verify the refresh token

    // try {
    //     //const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    //     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    // }
    // catch (e) {
    //     console.log(e);
    //     return res.status(401).send()
    // }

    let newToken = jwt.sign({id: decoded.id}, process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            //expiresIn: process.env.JWT_EXPIRES_IN
        })

        const cookieOptions = {
            expires: new Date(
                // Convierte fecha expiracion en milisegundos multiplicando (24 hrs * 60 mins * 60 seg * 1000 ms)
                Date.now() + 60 * 1000
                
                //+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }
    res.cookie("jwt", newToken, cookieOptions)
    res.status(201).send({
        idToken: newToken,
        expiresIn: 60,
    })
    
}