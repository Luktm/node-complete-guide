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

// // To be recall, code below method is sequenlize and mysql2 library being use
// const {Sequelize} = require('sequelize');

// // create new instance and connect to database
// const sequelize = new Sequelize('node-complete', 'root', '', {
//     dialect: 'mysql', 
//     host: 'localhost',
// });

// module.exports = sequelize;

// npm install --save mongodb, and connect to database.
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// Add connect string from mongo while pressed connect button in cluster db,
// insert password under security user,
// MongoClient.connect actually return promise, to check whether it connect successfully or failed

// Wrap into arrow function and export this function, and import it in app.js
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://luk1993:4dSCKp7DhWaQyykl@cluster0.chpu7.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            callback(client);
            console.log('Mongodb Connected');
        }).catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;