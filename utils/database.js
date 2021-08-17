// // npm install --save mysql2
// const mysql = require('mysql2');

// // cost efficient use createPool 
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '',
//     port: 3306
// });


// // asynchronise data, import in app.js
// module.exports = pool.promise();

const {Sequelize} = require('sequelize');

// create new instance and connect to database
const sequelize = new Sequelize('node-complete', 'root', '', {
    dialect: 'mysql', 
    host: 'localhost',
});

module.exports = sequelize;