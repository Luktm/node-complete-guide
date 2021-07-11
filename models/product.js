const db = require('../utils/database');


module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        // id was auto increment so just give it null
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        //                   extra secruity layer by adding ?, then insert data to second argument
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {
        
    }

    static fetchAll() {
        // return entire promise two nested array [a, b]
        return db.execute('SELECT * FROM products');
    }

    static from(json) {
    }

    static findById(id) {
        // ? question mark value simply let mysql inject security, we enter id at second array argument
        // return promise
       return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }

}