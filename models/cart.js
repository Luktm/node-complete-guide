// file system
const fs = require('fs');
// / in linus, \ in window
const path = require('path');
//                      root path /                       data/cart.json
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');



module.exports = class Cart {
    // like flutter Cart(this.products, this.total);
    // constructor() {
    //     this.propdcuts = [];
    //     this.totalPrice = 0;
    // }

    static addProduct(id, productPrice) {
        // Fetch the previous cart

        fs.readFile(p, (err, fileContents) => {
            // initialize the variable
            let cart = { products: [], totalPrice: 0 };

            // if cart has data
            if (!err) {
                // parse from string to json
                cart = JSON.parse(fileContents);
            }

            const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);

            // extract the specify object by index given
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct = {};

            if (existingProduct) {
                // copy existing product and assign to new variable
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;

                // copy hte old array
                cart.products = [...cart.products];
                // 
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // not exiting product found, assign an id and quantity
                updatedProduct = { id: id, qty: 1 };
                // this will be array with the old array product(obj), and assign new updatedProdcut object
                //              [{id: 1, qty: 1}, {id: 2, qty: 2}]
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + Number.parseInt(productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });

        });

        // Analyze the cart => Find Existing product
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }

            // copy new cart data, json parse = jsonDecode 
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find((prod) => prod.id === id);
            // if not product found
            if(!product) {
                return;
            }
            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);

            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            // jsonEncode in dart convert it to text format
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        })
    };

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);

            if(err) {
                cb(null);
            } else {

                cb(cart);
            }

        })
    }
}