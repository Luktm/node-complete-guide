const path = require('path');
// const http = require("http");
// express js is all about middleware
const express = require("express");
// const bodyParser = require("body-parser");
// bcuz express was export as function
const app = express();
// const exphbs = require("express-handlebars");


// mongodb import from utils/database where it setup to call mongo atlas
const mongoConnect = require('./utils/database');


// // install mysql and access it
// const sequelize = require('./utils/database');
// // model alwasy deal with database
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// `npm install --save ejs pug express-handlebars` install multiple 
// http://expressjs.com/en/4x/api.html#app.set, see 'view' and 'view engine' Property, app.set('view engine', 'value')
// app.set('view engine', 'pug'); // pug was build in

//                      optional if name is not layouts        default
// app.engine('hbs', exphbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})); // name, tool_to_use
// app.set('view engine', 'hbs'); // second name must match the key above

app.set('view engine', 'ejs'); // ejs was build in

// now we tell node we want to use view engine in the view template
// if we have different name of folder called template we should change it like:
// app.set('views', 'template');
// after that create the file with suffix name.pug in views folder like laravel name.blade.php
app.set('views', 'views');

// const rootDir = require('./utils/path');


// // import the exported express.Router and call app.use(adminRoutes) as an extension here
// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// // better to know how SQL query work to execute intended queries
// db.execute('SELECT * FROM products')
//     .then((result) => {
//         console.log(result[0], result[1]);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

/**
 * * we must always parse the request for req.body purpose
 * * `npm install --save body-parser`, but expressjs has already got it
 * * this parse incoming request to readable json format for all app.use(), app.get(), app.post, app.delete of request.body
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// open shop.html link css, we have to declare static path here in order to link it in html file
app.use(express.static(path.join(__dirname, 'public')));

// // middleware is only register here, unless incoming request has make,
// app.use((req, res, next) => {
//     User
//         .findByPk(1)
//         .then((user) => {
//             // * assign req.user to all route with User Model, so they can access relation defined down here.
//             req.user = user;
//             next();// continue next middleware
//         })
//         .catch((err) => console.log(err));
// });


// // import the outsource route and use it here, 
// // remember the order matter
// // filtering mechanism /admin route, so nested route don't have repeated
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// add 404 middleware for user miss use it, if all the path didn't exist
app.use(errorController.get404);

// To be recall, code below method is sequenlize and mysql2 library being use
// // sequenlize.sync method has to look all the model you define in models files, and basically create the table with s
// // make relation database

// // similar to laravel Product store user id, then next line hasMany
// Product.belongsTo(User, { constraint: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// // create one to one relation User has one cart
// User.hasOne(Cart);
// Cart.belongsTo(User);

// // many to many relation, this will create new table to store cart id and product id
// Cart.belongsToMany(Product, {through: CartItem}); // new middle table in CartItem
// Product.belongsToMany(Cart, {through: CartItem});

// // one to many relationship between order and user
// Order.belongsTo(User);
// User.hasMany(Order);

// // order many to many relationship, orderItem is middle table to store many to many relation
// Order.belongsToMany(Product, {through: OrderItem});
// Product.belongsToMany(Order, {through: OrderItem});

// sequelize
//     // overwrite the table for new changes by creating relation line 73
//     // this sync({force: true}) won't use in production
//     .sync() // sync is gonna create a new table if all model was defined.
//     .then((result) => {
//         // equivalent to line below
//         return User.findByPk(1);

//     }).then((user) => {
//         if (!user) {
//             return User.create({ name: 'Max', email: 'test@test.com' });
//         }

//         return user;
//     })
//     .then((user) => {
//         // User.hasOne(Cart) relation in line 90
//         // return created cart promise
//         return user.createCart();
//     })
//     .then((cart) => {
//         app.listen(3000, () => {
//             console.log("running on port 3000")
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// // since routes is (req, res) => {} arrow function, you can just pass in it,
// // before that it was http.createServer((req, res) => {});
// // const server = http.createServer(app); 

// // server.listen(3000);

// /**
//  * look at package.json, custom name script must prefix "npm run in front"
//  * `npm install "package" --save` for production
//  * `npm install "package" --save-dev` for development environments only
//  */







// Call the function from utils/database where we export it.
mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});