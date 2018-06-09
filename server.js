// Packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

const Table = require('./tablesetup');
const Auth = require('./server_auth');
const Webclient = require('./webclient');
const config = require('./dbconfig');
const Products = require('./service/productManager');


// Setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
	limit:1024*1024*20,
	type:'application/json'
}));
app.use(bodyParser.urlencoded({
	extended:true,
	limit:1024*1024*20
}));
app.use(cookieParser());
app.listen(process.env.PORT || 8081, function () {
  console.log('Server is running.');
});

// Normal response
const standardResponse = (req, res, next) => {
	console.log('Standard response: true');
	res.send({'result':true});
};

app.get('/', Webclient.getStartView);
app.get('/products', Products.getProducts, Webclient.getProductsView); //Needed??? Should work with only the other one.
app.get('/products/:type', Products.getProducts, Webclient.getProductsView);
app.get('/product/:product_id', Products.getProduct, Webclient.getProductView);

//Post-requests
/*app.post('/register', Users.register, standardResponse);
app.post('/userpage', Auth, Users.loadPic, Users.login, function(req, res, next){
	res.clearCookie('x_access_token');
	res.cookie('x_access_token', req.token, { expires: new Date(Date.now() + (60*60*1000)), httpOnly: true, secure: false });
}, Auth, standardResponse);*/

//tablesetup
app.get('/setup/', Table.deleteTables, Table.createTables, Products.createDefaultProducts, standardResponse);

// Route not found - default to '/'
app.get('*', function(req, res, next) {
	console.log('Route not found: ', req.url);
	res.redirect('/');
});
