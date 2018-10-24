/**
 * Created by matej on 21/10/2018.
 */

const mysql = require('mysql');
const util = require('util');
const config = require('../config');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database
});

pool.getConnection(function(err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    // if (connection) connection.release();
});

pool.query = util.promisify(pool.query);

module.exports = pool;