var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MySQL conectado...');
    }
});

// const db = mysql.createPool({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'beb90720c75794',
//     password: 'c6b640d1',
//     database: 'heroku_a1ac1fb2f4f6661'
//   });

module.exports = db;
