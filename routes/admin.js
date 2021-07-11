const path = require('path');
const express = require('express');

// const rootDir = require('../utils/path');

const adminController = require('../controllers/admin');

/**
 * mini express app plugable to other express
 * app.use() to router.user() for other js file to access by import it
 */
const router = express.Router();

/**
 * 
 * * remember this route can also be access by https://our-domain/another-page
 * * so home page / always add to the bottom
 * since we didn't put next so it won't jump to the next middleware
 */

// app.use('/', (req, res, next) => {
//     console.log('this always runs!');
//     next(); // jump to next middleware
// });

// /admin/add-product => GET
// pass controller here like (req, res) => {}
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// we can extract the product id to getEditProduct controller
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product/', adminController.postEditProduct);

router.post('/delete-product' ,adminController.postDeleteProduct);

// provide the name, multiple exports node auto merge it into one object
module.exports = router;
