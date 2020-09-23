require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const winston = require('winston');
const routeCatalogs = require('./route/Catalog')
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

app.use('/api/sanpham' , routeCatalogs);
app.use(errorMiddleware);


const server = app.listen(port, () => {
  console.log('App listening on ' + port );
})
module.exports = server;