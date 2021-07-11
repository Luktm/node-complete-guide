// file system
const fs = require('fs');
// / in linus, \ in window
const path = require('path');

const Cart = require('./cart');

const p = path.join(path.dirname(require.main.filename), 'data', 'product.json');

const getProductsFormFile = (cb) => {

    // read the give file path
    fs.readFile(p, (err, fileContent) => {
        // find empty data
        if (err) {
            cb([]);
        } else {
            // keep in mind every json retrive as a text, we need parse it
            cb(JSON.parse(fileContent));
        }
    });


};

module.exports = class Product {

    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFormFile((products) => {

            if (this.id) {
                const exitingsProductIndex = products.findIndex((prod) => prod.id === this.id);
                // copy products
                const updatedProducts = [...products];
                updatedProducts[exitingsProductIndex] = this;

                // save to product.json
                fs.writeFile(p, JSONstringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {

                this.id = Math.random().toString();
                products.push(this);

                // write the new file entry if not error
                //     path_to_save   convert_json_to_string_format
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });

                // this mean this whole class instance push to product array
                // product.push(this);

                // store json in data.js file 
                //                          .root               /data/, create_file

                // // read the path return promise cb
                // fs.readFile(p, (err, fileContent) => {
                //     let products = [];

                //     // if has product mean not error
                //     if (!err) {
                //         products = JSON.parse(fileContent);
                //     }

                //     // // this return to the class
                //     products.push(this);

                //     // write the new file entry if not error
                //     //     path_to_save   convert_json_to_string_format
                //     fs.writeFile(p, JSON.stringify(products), (err) => {
                //         console.log(err);
                //     });
                // });

            }
        });
    }


    static deleteById(id) {
        getProductsFormFile((products) => {
            const product = products.find((prod) => prod.id === id);
            // filter return new array
            const updatedProduct = products.filter((prod) => prod.id === id);
            fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFormFile(cb);
    }

    static from(json) {
        return Object.assign(new Product(), json)
    }

    static findById(id, cb) {
        getProductsFormFile(products => {
            const product = products.find((p) => p.id === id);
            cb(product);
        });
    }

}