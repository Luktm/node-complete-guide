const path = require('path');
// const http = require("http");
// express js is all about middleware
const express = require("express");
// const bodyParser = require("body-parser");
// bcuz express was export as function
const app = express();
// const exphbs = require("express-handlebars");

// install mysql and access it
const db = require('./utils/database');

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


// import the exported express.Router and call app.use(adminRoutes) as an extension here
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// you need to know sql
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

// import the outsource route and use it here, 
// remember the order matter
// filtering mechanism /admin route, so nested route don't have repeated
app.use('/admin', adminRoutes); 
app.use(shopRoutes);

// add 404 middleware for user miss use it, if all the path didn't exist
app.use(errorController.get404);

// equivalent to line below
app.listen(3000, ()=> {
    console.log("running on port 3000")
});

// since routes is (req, res) => {} arrow function, you can just pass in it,
// before that it was http.createServer((req, res) => {});
// const server = http.createServer(app); 

// server.listen(3000);

/**
 * look at package.json, custom name script must prefix "npm run in front"
 * `npm install "package" --save` for production
 * `npm install "package" --save-dev` for development environments only
 */