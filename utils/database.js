// npm install --save mysql2
const mysql = require('mysql2');

// cost efficient use createPool 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '',
    port: 3306
});


// asynchronise data, import in app.js
module.exports = pool.promise();