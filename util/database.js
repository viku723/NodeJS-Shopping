const db = require('mysql2');

const pool = db.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'viku8300'
});

module.exports = pool.promise();