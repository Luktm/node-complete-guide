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


    // mongo model goes here
    // req.user._id assigned from app.js at line 80
    const product = new Product(title, price, description, imageUrl, null, req.user._id);    
    
    // this replace by mongodb at line 70
    // // since it has relation set up in app.js line 84 to 85,
    // // user hasMany() will generate createProduct(); method for us with user id given
    // // it prefix create in front Product model, it a way to make sure what model to belong
    // req.user.createProduct({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    // })
    

    // this replace by above createProduct
    // // get the model which it has connect to database
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     // from app.js req.body.userId = user
    //     userId: req.user.id,
    // })

    // look at line 43
    product.save()
        .then((result) => {
            console.log('Created Product');
            res.redirect('/admin/products');
        }).catch((err) => {
            console.log(err);
        });
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

    // in order to get current login user product, it called by this method as it has relation setup in app.js
    // it prefix `get` suffix with `s`  
    // sequenlize doc https://sequelize.org/docs/v6/
    // req.user.getProducts({ where: {id: prodId } })

    // sequenlize doc https://sequelize.org/docs/v6/
    // Product.findByPk(prodId) // from sequelize fetch all product
    
    Product.findById(prodId)
        .then((product) => {
            // it return array
            // from sequenlize we need extract from array
            // const product = products[0];

            // mongodb
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
    
    // sequenlize doc https://sequelize.org/docs/v6/
    // Product.findByPk(prodId)

    // Product.findById(prodId)
    //     .then((productData) => {
        // // note this won't change the data in database, it only do locally
        // // sequenlize method
        // product.title = updatedTitle;
        // product.price = updatedPrice;
        // product.description = updatedDesc;
        // product.imageUrl = updatedImageUrl;
        // this provide by sequenlize, it will udpate the existed, if not, then it will create a new entry

        // return product.save();
    // })

        const product =  new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
        product
            .save()
            .then((result) => {
                console.log('UPDATED PRODUCT');
                res.redirect('/admin/products');
            })
            .catch((err) => {
                console.log(err);
            })
}

module.exports.getProducts = (req, res, next) => {

    // instead of finding all product, we find login user product
    // Product.findAll()
        // req.user.getProducts()

        // Mongodb model
        Product.fetchAll()
            .then((products) => {
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
    }).catch((err) => {
        console.log(err);
    });
};

module.exports.postDeleteProduct = (req, res, next) => {
    // from input hidden
    const prodId = req.body.productId;

    // sequenlize delete by id
    // Product.findByPk(prodId)

    // mongodb
    Product.deleteById(prodId)
        
    // sequelize method
        // .then(product => {
        //     return product.destroy();
        // })

        .then((result) => {
            console.log('DESTROYER PRODUCT');
            res.redirect('/admin/products');
        }).catch((err) => {
            console.log(err);
        });
};