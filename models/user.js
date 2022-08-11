// Sequelize method
// const { Sequelize } = require('sequelize');;

// const sequelize = require('../utils/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING,
// });

// module.exports = User;

// mongodb model to call database api, later then it would be needed in controller
const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    // get invoke in shop.js controller at line 142, 
    // cart has given the user id early in app.js line 81
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            // cp.productId get from users table cart property 
            // product._id did not treated as string type, so either set == or toString()
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        // [spread array item]
        const updatedCartItems = [...this.cart.items];

        // index not found it return -1, otherwise it return index of product, it found
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            // find cart item depending found index from line 39
            // update quantity only if item exist in the cart list
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            // add new map {productId: "", https://www.udemy.com/certificate/UC-31dd0c87-5ffd-433b-887e-88b025c920af/: 1}
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }


        // save product id so we fetch product base on id
        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();
        // find user based on user's id and update 
        return db.collection('users').updateOne(
            // find by user id, _id has assigned to this class early in app.js line 81
            { _id: new ObjectId(this._id) },
            // overwrite existing the cart object {items: []}
            { $set: { cart: updatedCart } }
        );
    }

    getCart() {
        // direct return this cart list, 
        // since app.js line 81 has assigned pass to user model already
        // return this.cart;

        // But we need get populated populated cart item
        const db = getDb();

        const productIds = this.cart.items.map((item) => {
            return item.productId;
        });
        // read mongodb documentation what is $in, which hold references through all product array
        // simply put, give me all product which contain those productIds array;
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            // convert to array
            .toArray()
            .then((products) => {
                return products.map(p => {
                    // make sure use arrow function, so this can reference within the block.
                    return {
                        ...p,
                        quantity: this.cart.items.find((item) => {
                            return item.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        // this cart existing whereby app.js assigned at line 81
        // filter return new array 
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                // $set mean update if don't exist, otherwise overwrite it
                // read mongodb documentation
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    addOrder() {
        const db = getDb();
        // products which is array of product, eg; [ {...products, quantity: ... } ];
        return this.getCart().then((products) => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name,
                },
            };

            return db
                .collection('orders')
                // this.cart = { items: [{productId: ..., quantity:... }] }
                .insertOne(order);

        }).then((result) => {
            // once order has added, clear user cart object
            console.log(result);
            this.cart = { items: [] };
            return db
                .collection('users')
                .updateOne(
                    { _id: new ObjectId(this._id) },
                    // $set mean update if don't exist, otherwise overwrite it
                    // read mongodb documentation
                    { $set: { cart: { items: [] } } }
                );
        });
    }

    getOrders() {
        const db = getDb();
        // orders > user > _id
        return db
            .collection('orders')
            .find({"user._id": new ObjectId(this._id)})
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        // next() is to get the first element, but findOne done the same job
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
                console.log(user);
                return user;
            }).catch((err) => {
                console.log(err)
            });
    }
}

module.exports = User;