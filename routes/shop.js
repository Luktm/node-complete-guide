// absolute path for global variables available for node js by 
// writng path.join(__dirname, 'views', 'shop.html'), don't put slash
// this will automatically build the path in a way that works for both linus and window
const path = require('path');

const express = require('express');

// const rootDir = require('../utils/path');
// const adminData = require('./admin');
const shopController = require('../controllers/shop');
const { route } = require('./admin');

// same as app.use(), but it's for outsource method
const router = express.Router();

// // use() allow us to use middleware function
// // this executed for every incoming request
// router.use((req, res, next) => {
//     console.log("in the middleware");

//     // next() allows the request to continue to the next middlware in line.
//     next();
// });

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// similar in laravel '/products/{productId}', we can retrieve it in callback function, and order matter
// like '/products/delete' specific route should put at first before dynamic route
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct)

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


module.exports = router;