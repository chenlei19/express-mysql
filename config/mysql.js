const mysql = require('mysql');
const dbconfig = {
    host: 'localhost',
    port:3306,
    user: "root",
    password:'123456',
    database:'data'
}

const pool = mysql.createPool(dbconfig)
module.exports = pool
