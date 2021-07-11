// import model
const Product = require('../models/product');

// controller later pass it into routes/admin.js
module.exports.getAddProduct = (req, res) => {
    console.log('In another middleware!');

    // like laravel controller view('name.blade.php')
    /**
     * path.join() provide os path eg: linus path is '/user/products', but on window is '\user\products, it detect based on your OS.
     * __dirname give us the path to a file which we use it and,
     * routes/views/shop.html, but we can fix it by adding '../' at second argument, then it become ../routes/views/shop.html.
     */
    //                       routes     ../   views     add-product.html   =>  ../routes/views/add-product.html
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

    // // normally action is for php, if js it direct it to specify middleware
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"/><button type="submit">Add Product</button></form>');

    // npm install --save ejs pug express-handlebars and,
    // set as default engine in app.js
    // render('shop') rather than render('shop.pug')
    // add-product.pug
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        // formsCSS: true, 
        // productCSS: true, 
        // activeAddProduct: true
    })
};

module.exports.postAddProduct = (req, res, next) => {
    // req.body.title come from <input name="title"/>
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title, imageUrl, description, price);

    product
        .save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => { 
            console.log(err);
        });

    // redirect to specify route
    res.redirect('/');
};

// controller later pass it into routes/admin.js
module.exports.getEditProduct = (req, res) => {
    // * using query parameter `admin/edit-product/12345?edit=true`, remember it's a string
    const editMode = req.query.edit;

    const isEditMode = editMode == 'true' ? true : false;

    // just a redundant to demostrate we can use this approach 
    if (!isEditMode) {
        return res.redirect('/');
    }

    // get from route /product/:productId
    const prodId = req.params.productId;

    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: isEditMode,
            product: product
        });
    });


};

module.exports.postEditProduct = (req, res, next) => {
    // from edit hidden input name with productId
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedPrice, updatedImageUrl, updatedDesc);
    // save and overwrite exisiting one
    updatedProduct.save();
    res.redirect('/admin/products');
}

module.exports.getProduct = (req, res, next) => {

    // pass callback
    Product.fetchAll((products) => {
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
        // render('admin') rather than render('shop.pug')
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};

module.exports.postDeleteProduct = (req, res, next) => {
    // from input hidden
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};