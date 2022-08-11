// // sequalize go here
// const { Sequelize } = require('sequelize');

// // database connection
// const sequelize = require('../utils/database');

// // define model by sequelize style, it auto create products if we put sequelize.sync() in app.js
// // this sequelize has already connect to database and then define model by that
// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
// });

// module.exports = Product;



// mongodb model goes here

// this look weird is because it export as `exports.getDb = FUNC_TO_EXPORT`;
const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
    title;
    price;
    description;
    imageUrl;
    _id;

    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        // to overcome at line 64 where it create object regardless is null or undefined.
        this._id = id ?  new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        // initial mongodb and then we could call which table to insert, write, read, update docs.
        // side note, initial mongodb application string should've database name, see line at database.js's 42
        const db = getDb();
        let dbOp;

        // check has id being set, if yes, run mongo update operator
        if (this._id) {
            // Update the product such as updateOne, updateMany
            dbOp = db
                .collection('products')
                // find which id and 
                .updateOne({ _id: this._id }, {
                    // and describe new value with object.
                    // we can set it explicit way {$set: {title: this.title}}.
                    // this refer to this class, class is behave like object
                    $set: this
                });
        } else {
            // Add new product
            dbOp = db.collection('products').insertOne(this);
        }

        // invoke insertOne(), insertMany() from mongo
        // `this` refer to Product object
        // navigate to admin.js update product model accordingly

        // return this promise, so product.js can use then() method by invoke as product.save().then()
        return dbOp
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
    }

    static fetchAll() {
        // initial mongodb and then we could call which table to insert, write, read, update docs.
        // side note, initial mongodb application string should've database name, see line at database.js's 42
        const db = getDb();

        // toArray() mean retuFrn all document and turn into array, other it's better to implement pagination
        return db
            .collection('products')
            .find()
            .toArray()
            .then((products) => {
                console.log(products)
                return products;
            })
            .catch((err) => {
                console.log(err)
            });
    }

    static findById(prodId) {
        const db = getDb();

        // narrow down by insert object in find()
        // mongodb doesn't know we only want to get one, we use next() function to get next item
        return db
            .collection('products')
            // mongodb store id as a bson, something like ObjectId(""), so let's import mongodb ObjectId construtor
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then((product) => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err)
            });
    }

    static deleteById(prodId) {
        const db = getDb();
        // https://www.mongodb.com/docs/v4.4/tutorial/remove-documents/
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then((result) => {
                console.log('Deleted');
            }).catch((err) => {
                console.log(err);
            });
    }

}

module.exports = Product;