require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

const routeCatalogs = require('./route/Catalog')
const routeGroup = require('./route/musicalInstrument')
const routeAllProduct = require('./route/EachProduct')

const errorMiddleware = require('./middleware/error')

require('winston-mongodb');
 
require('./startup/db')();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.redirect('/api/sanpham');
})  

app.use('/api/catalogs' , routeCatalogs);
app.use('/api/sanpham' , routeGroup);
app.use('/api/all-product' , routeAllProduct);
app.use(errorMiddleware);


const server = app.listen(port, () => {
  console.log('App listening on ' + port );
})
module.exports = server;