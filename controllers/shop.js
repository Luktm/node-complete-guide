// import model
const Product = require('../models/product');

module.exports.getProducts = (req, res, next) => {

    Product
        .findAll()
        .then((products) => {
            // send() response set to default header text/html

            console.log();

            /**
             * path.join() provide os path eg: linus path is '/user/products', but on window is '\user\products, it detect based on your OS.
             * __dirname give us the path to a file which we use it and,
             * routes/views/shop.html, but we can fix it by adding '../' at second argument, then it become ../routes/views/shop.html.
             */
            //                       routes     ../   views     shop.html   =>  ../routes/views/shop.html
            // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

            // inject it to template, like laravel, view('view', ['prods' => dyanmic_data, 'docTitle': 'show'])
            // const products = adminData.products

            // npm install --save ejs pug express-handlebars and,
            // set as default engine in app.js
            // render('shop') rather than render('shop.pug')
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All product',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log(err);
        });


};

exports.getProduct = (req, res, next) => {
    // get dynamic segment route `/products/:productId`
    // * get return params
    const prodId = req.params.productId;

    // // by default this give us an array
    // Product.findAll({where: {id: prodId}}).then(products => {
    //     res.render('shop/product-detail', {
    //         product: products[0],
    //         pageTitle: products[0].title,
    //         path: '/products'
    //     });
    // }).catch((err)=> {
    //     console.log(err);
    // });

    // [product] return from db.execute() promise as array [0, 1]
    Product.findByPk(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    }).catch((err) => {

    });

};

module.exports.getIndex = (req, res, next) => {

    Product
        .findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports.getCart = (req, res, next) => {
    // getCart which has accosiate setup in app.js in line 91 User.hasOne(Cart) & Cart.belongsTo(User);
    // but we have to create the cart with user id associate, see in app.js user.createCart() invocation at the right bottom.
    req.user.getCart()
        .then((cart) => {
            // return product which has cart associated with. see app.js one to one, one to many and many to many relation
            // since cart was call from user, 
            // mean this product will only display that particular user
            return cart
                .getProducts().then((products) => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                });
        })
        .catch((err) => console.log(err));

    // Cart.getCart((cart) => {
    //     Product.fetchAll(products => {

    //         const cartProducts = [];

    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }

    //         // render view
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     });

    // })
};

module.exports.postCart = (req, res, next) => {
    // post return body
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    // req.user.getCart has relation betwenn User and Cart, that's why we can use getCart invocation
    req.user
        .getCart() // since this will fetch login user, cart will return this particular user
        .then((cart) => {

            console.log({"nani": cart});
            
            fetchedCart = cart;
            // cart has relation with Product
            // fetch cart where already has user id associate, get cartItem product
            return cart.getProducts({ where: { id: productId } });

        })
        .then((products) => {
            let product;
            // get first product
            if (products.length > 0) {
                product = products[0];
            }

            // update exisiting product quantity
            if (product) {
                // product.cartItem able to call bcuz they have relation, cartItem is what defined in model
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;// return existing product
            }

            // no existing product found in the cart then search Product model with id, and later add to the cart
            return Product.findByPk(productId);
        })
        // this product will hold two different product 
        .then((product) => {
            // since product has many to many relation with cart, we can simply call this addProduct() generated from sequelize, it store in cart-item table
            return fetchedCart.addProduct(product, {
                // through set what model or table to store, provide property what in the table
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));

    // Product.findById(productId, (prod) => {
    //     Cart.addProduct(productId, prod.price);
    // });

    // return to the get route cart
    // res.redirect('/cart');
};

module.exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user
        .getCart()
        .then((cart) => {
            // cart has many 2 many relation to product, and return specific product
            return cart.getProducts({ where: {id: prodId} });
        })
        .then((products) => {
            // get the first array
            const product = products[0];
            // cartItem is middle table of product and cart, so product can be retrieved form this table
            // destory is sequelize feature, becuz of the relation setup
            return product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err))

    // Product.findById(prodId, (product) => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });
}

module.exports.postCreateOrder = (req, res, next) => {
    let fetchedCart;
    // req user was assigned by User model findByPk, and user has one relation with cart
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            // cart has many to many relations with products, getProducts auto generate by sequenlize
            return cart.getProducts();
        })
        .then((products) => {
            // user has one relation with order, so createOrder is predifined by sequenlize
            return req.user
                .createOrder()
                .then((order) => {
                    // order has many to many relations with product, addProduct() is predifined by sequenlize
                    // order.addProducts(products, {add_column_property}) // add products to middle orderItems table by given the object
                    order.addProducts(products.map((product) => {
                        // orderItem is middle table for order & product table many to many relationship
                        // assign properties to orderItem table's column
                        // product has many to many relations with order, and cart, that's why product can access to cartItems and orderItems
                        product.orderItem = { quantity: product.cartItem.quantity };
                        // must return modified product to addProducts()
                        return product;
                    })); // add products to middle table by given the object
                })
                .then((result) => {
                    // cart has relation with product, setProduct from sequenlize
                    // logic here is order being place, clear cart's products
                    return fetchedCart.setProduct(null);
                    res.redirect('/orders');
                })
                .catch((err) => console.log(err));
            
        });
}

module.exports.getOrders = (req, res, next) => {
    // user has one to many relationship with order, thanks to association from app.js req.user = User.findByPk(1) at line 66
    // similar to laravel with() to retrive relations, products table created from Product model, that's how we named it, 
    // so we can use order.products.forEach(product => { product.orderItem.quantity })
    req.user.getOrders({ include: ['products'] }) 
        .then((orders) => {
            console.log(orders);
              // render view
             //  view/shop/orders.ejs
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Cart',
                orders: orders
            });
        }).catch((err) => {
            console.log(err);
        });
};

// module.exports.getCheckout = (req, res, next) => {

//     // render views
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pathTitle: 'Checkout'
//     });

// };
