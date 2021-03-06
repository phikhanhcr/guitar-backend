require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
var cors = require('cors')
const listEndpoints = require('express-list-endpoints')
const routeCatalogs = require('./route/Catalog')
const routeGroup = require('./route/musicalInstrument')
const routeAllProduct = require('./route/EachProduct')
const routeUser = require('./route/User')
const errorMiddleware = require('./middleware/error')
const routeCart = require('./route/Cart')
const routeLogin = require('./route/Login')
const AuthTokenMiddleware = require('./middleware/AuthTokenMiddleware')
const routeDonHang = require('./route/DonDatHang');
const routeAdmin = require('./route/LoginAdmin')
const routeAdminOrder = require('./route/AdminOrder')
app.use(cors())

require('winston-mongodb');
require('./startup/db')();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.redirect('/api/catalogs');
})

app.use(express.static('public'));
app.use('/api/cart',
  AuthTokenMiddleware.checkAuthToken,
  routeCart
)
app.use('/api/user',
  AuthTokenMiddleware.checkAdminToken,
  routeUser
);
app.use('/api/catalogs', routeCatalogs);
app.use('/api/group', routeGroup);
app.use('/api/all-product' ,routeAllProduct);
app.use(errorMiddleware);
app.use('/login', routeLogin);
app.use('/api/donhang', AuthTokenMiddleware.checkAuthToken, routeDonHang)
app.use('/admin-login', routeAdmin)
app.use('/api/admin-donhang', AuthTokenMiddleware.checkAdminToken, routeAdminOrder)
const server = app.listen(port, () => {
  console.log('App listening on ' + port);
})
//console.log(listEndpoints(app));
module.exports = server;