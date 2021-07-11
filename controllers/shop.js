// import model
const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (req, res, next) => {

    // pass callback
    Product.fetchAll().then(([products]) => {
        // send() response set to default header text/html
        
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
    });
};

exports.getProduct = (req, res, next) => {
    // get dynamic segment route `/products/:productId`
    // * get return params
    const prodId = req.params.productId;

    // [product] return from db.execute() promise as array [0, 1]
    Product.findById(prodId).then(([product])=> {
        res.render('shop/product-detail', {
            product: product[0],
            pageTitle: product.title,
            path: '/products'
        });
    }).catch((err)=> {

    });

};

module.exports.getIndex = (req, res, next) => {
    // bcuz mysql execute return two nested array
    Product.fetchAll()
        .then(([rows, fieldData])=> {
            return res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: rows.length > 0,
                activeShop: true,
                productCSS: true,
            });
    }).catch((err) => {
        console.log(err);
    });
}

module.exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {

            const cartProducts = [];

            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }

            // render view
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });

    })
};

module.exports.postCart = (req, res, next) => {
    // post return body
    const productId = req.body.productId;
    Product.findById(productId, (prod) => {
        Cart.addProduct(productId, prod.price);
    });

    // return to the get route cart
    res.redirect('/cart');
};

module.exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

module.exports.getOrders = (req, res, next) => {
    // render view
    //          view/shop/orders.ejs
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Cart',
    });
};

module.exports.getCheckout = (req, res, next) => {

    // render views
    res.render('shop/checkout', {
        path: '/checkout',
        pathTitle: 'Checkout'
    });

};
