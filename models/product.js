// sequalize go here
const { Sequelize } = require('sequelize');

// database connection
const sequelize = require('../utils/database');

// define model by sequelize style, it auto create products if we put sequelize.sync() in app.js
// this sequelize has already connect to database and then define model by that
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Product;;